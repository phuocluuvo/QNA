import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { Question } from "./entity/question.entity";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { paginate, PaginateQuery } from "nestjs-paginate";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { plainToClass } from "class-transformer";
import { VoteType } from "../enums/vote-type.enum";
import { VoteService } from "../vote/vote.service";
import { VoteQuestionDto } from "../vote/dto/vote-question.dto";
import { message } from "../constants/message.constants";
import { TagService } from "../tag/tag.service";
import { questionPaginateConfig } from "../config/pagination/question-pagination.config";
import { ActivityService } from "../activity/activity.service";
import {
  ObjectActivityTypeEnum,
  ReputationActivityTypeEnum,
} from "../enums/reputation.enum";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class QuestionService {
  constructor(
    @Inject("QUESTION_REPOSITORY")
    private readonly questionRepository: Repository<Question>,
    private readonly voteService: VoteService,
    private readonly tagService: TagService,
    private readonly activityService: ActivityService,
  ) {}

  /**
   * Find questions based on pagination options.
   *
   * @param query - Pagination options.
   * @param tagNames - The tag names to filter questions by.
   * @returns A paginated list of questions.
   */
  async find(query: PaginateQuery, tagNames: string) {
    const tags = tagNames ? tagNames.split(",") : [];
    const queryBuilder = this.questionRepository.createQueryBuilder("question");

    const subQuery = `
    COALESCE(
        (SELECT JSON_ARRAYAGG(t.name)
         FROM tag AS t
         JOIN question_tag AS qt ON t.id = qt.tag_id
         WHERE qt.question_id = question.id),
        JSON_ARRAY()
      )
      `;
    queryBuilder.where(`JSON_CONTAINS( ${subQuery}, :tags)`, {
      tags: JSON.stringify(tags),
    });

    return await paginate<Question>(
      query,
      queryBuilder,
      questionPaginateConfig,
    );
  }

  /**
   * Find a question by its ID.
   *
   * @param id - The ID of the question to find.
   * @returns The found question.
   * @throws NotFoundException if the question does not exist.
   */
  async findOneById(id: string) {
    const question = await this.questionRepository.findOne({
      where: { id: id },
      relations: ["user"],
    });

    if (!question) {
      throw new NotFoundException(message.NOT_FOUND.QUESTION);
    }
    return question;
  }

  /**
   * Create a new question.
   *
   * @param questionDto - The question data to create.
   * @param userId - The ID of the user creating the question.
   * @returns The created question.
   */
  async create(
    questionDto: CreateQuestionDto,
    userId: string,
  ): Promise<Question> {
    const questionTrans = plainToClass(CreateQuestionDto, questionDto, {
      excludeExtraneousValues: true,
    });
    questionTrans["user"] = userId;
    questionTrans["tags"] = await this.tagService.checkAndTransTags(
      questionDto.tag_ids ? questionDto.tag_ids : [],
    );
    return this.questionRepository.save(questionTrans);
  }

  /**
   * Update a question by its ID.
   *
   * @param id - The ID of the question to update.
   * @param questionDto - The updated question data.
   * @returns The updated question.
   * @throws NotFoundException if the question does not exist.
   */
  async update(id: string, questionDto: UpdateQuestionDto) {
    const questionTrans = plainToClass(UpdateQuestionDto, questionDto, {
      excludeExtraneousValues: true,
    });

    if (questionDto.tag_ids) {
      questionTrans["tags"] = await this.tagService.checkAndTransTags(
        questionDto.tag_ids ? questionDto.tag_ids : [],
      );
    }

    const question = await this.questionRepository.preload({
      id: id,
      ...questionTrans,
    });
    delete question.tagNames;

    return this.questionRepository.save(question);
  }

  /**
   * Remove a question by its ID.
   *
   * @returns The removed question.
   * @throws NotFoundException if the question does not exist.
   * @param question
   */
  async remove(question: Question) {
    return this.questionRepository.remove(question);
  }

  /**
   * Get a question by its ID and increase its view count.
   *
   * @param questionId - The ID of the question.
   * @param userId logged in user id
   * @returns The question with an increased view count.
   * @throws NotFoundException if the question does not exist.
   */
  async getQuestionAndIncreaseViewCount(
    questionId: string,
    userId: string,
  ): Promise<Question> {
    try {
      const question = await this.questionRepository.findOne({
        where: { id: questionId },
        relations: ["user", "tags"],
      });
      if (!question) {
        throw new NotFoundException(message.NOT_FOUND.QUESTION);
      }
      return await this.increaseViewCount(question, userId);
    } catch (error) {
      const question = await this.questionRepository.findOne({
        where: { id: questionId },
        relations: ["user"],
      });
      if (!question) {
        throw new NotFoundException(message.NOT_FOUND.QUESTION);
      }
      return await this.increaseViewCount(question, userId);
    }
  }

  /**
   * update vote count.
   *
   * @param userId - The ID of the user.
   * @param questionVoteDto - The question data to update.
   * @returns The question with an increased view count.
   * @throws NotFoundException if the question does not exist.
   */
  @Transactional()
  async updateVote(
    userId: string,
    questionVoteDto: VoteQuestionDto,
  ): Promise<Question> {
    const question = await this.findOneById(questionVoteDto.question_id);

    if (!question) {
      throw new NotFoundException(message.NOT_FOUND.QUESTION);
    }

    const createVote = await this.voteService.voteQuestion(
      userId,
      questionVoteDto,
    );

    if (questionVoteDto.vote_type === VoteType.UPVOTE) {
      question.votes += createVote;
    } else if (questionVoteDto.vote_type === VoteType.DOWNVOTE) {
      question.votes -= createVote;
    }

    try {
      return this.questionRepository.save(question);
    } catch (error) {
      throw new Error("Error updating vote");
    }
  }

  /**
   * Increase view count of a question.
   * @param question - The question to increase view count.
   * @param userId - The ID of the user viewing the question.
   * @private
   */
  @Transactional()
  private async increaseViewCount(question: Question, userId: string) {
    question.views += 1;
    const result = await this.questionRepository.save(question);
    result.vote = [];

    if (userId) {
      const voteInfo = await this.voteService.getVote({
        user: { id: userId },
        question: { id: question.id },
      });

      if (voteInfo) {
        result.vote.push(voteInfo);
      }
    }
    return result;
  }

  /**
   * Create a new question with activity.
   * @param questionDto - The question data to create.
   * @param userId - The ID of the user creating the question.
   */
  @Transactional()
  async createWithActivity(questionDto: CreateQuestionDto, userId: string) {
    if (await this.activityService.checkCreateQuestion(userId)) {
      const question = await this.create(questionDto, userId);
      await this.activityService.create(
        ReputationActivityTypeEnum.CREATE_QUESTION,
        ObjectActivityTypeEnum.QUESTION,
        question.id,
        userId,
      );

      return question;
    } else {
      throw new BadRequestException(message.REPUTATION.NOT_ENOUGH);
    }
  }

  /**
   * Update a question with activity.
   * @param question - The question to update.
   * @param userId - The ID of the user updating the question.
   */
  @Transactional()
  async removeWithActivity(question: Question, userId: string) {
    await this.activityService.create(
      ReputationActivityTypeEnum.DELETE_QUESTION,
      ObjectActivityTypeEnum.QUESTION,
      question.id,
      userId,
    );
    await this.activityService.syncPointDelete(question.id, userId);
    return this.remove(question);
  }

  /**
   * Find questions related by tag based on pagination options.
   *
   * @param query - Pagination options.
   * @param tagNames - The tag names to filter questions by.
   * @returns A paginated list of questions.
   */
  async related(query: PaginateQuery, tagNames: string) {
    const tags = tagNames ? tagNames.split(",") : [];
    const queryBuilder = this.questionRepository.createQueryBuilder("question");
    queryBuilder.leftJoinAndSelect("question.tags", "tag");
    tags.forEach((tag, index) => {
      queryBuilder.orWhere("tag.name = :tag" + index, { ["tag" + index]: tag });
    });
    return await paginate<Question>(
      query,
      queryBuilder,
      questionPaginateConfig,
    );
  }
}
