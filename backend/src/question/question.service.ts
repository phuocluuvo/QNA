import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Question } from "./entity/question.entity";
import { CreateQuestionDto } from "./dto/create-question.dto";
import {
  IPaginationOptions,
  paginateRawAndEntities,
} from "nestjs-typeorm-paginate";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { plainToClass } from "class-transformer";
import { VoteType } from "../enums/vote-type.enum";
import { VoteService } from "../vote/vote.service";
import { VoteQuestionDto } from "../vote/dto/vote-question.dto";
import { message } from "../constants/message.constants";

export class QuestionWithCount extends Question {
  countAnswer: number;
}

@Injectable()
export class QuestionService {
  constructor(
    @Inject("QUESTION_REPOSITORY")
    private questionRepository: Repository<Question>,
    private readonly voteService: VoteService,
  ) {}

  /**
   * Find questions based on pagination options.
   *
   * @param options - Pagination options.
   * @returns A paginated list of questions.
   */
  async find(options: IPaginationOptions) {
    const queryBuilder = this.questionRepository.createQueryBuilder("question");
    queryBuilder
      .select([
        "question.id",
        "question.title",
        "question.content",
        "question.views",
        "question.votes",
        "question.createdAt",
        "question.updatedAt",
        "user.id",
        "user.username",
        "user.fullname",
        "user.avatar",
        "user.dob",
        "user.email",
        "user.role",
        "COUNT(answer.id) as countAnswer",
      ])
      .innerJoin("question.user", "user")
      .leftJoin("question.answers", "answer")
      .groupBy("question.id, user.id")
      .orderBy("question.updatedAt", "DESC");

    const [pagination, rawResults] = await paginateRawAndEntities<Question>(
      queryBuilder,
      options,
    );
    pagination.items.map((item, index) => {
      const check = rawResults.find((raw: any) => raw.question_id === item.id);
      if (check) {
        item["countAnswer"] = rawResults[index]["countAnswer"];
      }
    });

    return pagination;
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
    const question = await this.questionRepository.preload({
      id,
      ...questionTrans,
    });

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
  async getAndIncreaseViewCount(
    questionId: string,
    userId: string,
  ): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ["user"],
    });

    if (!question) {
      throw new NotFoundException(message.NOT_FOUND.QUESTION);
    }

    question.views += 1;
    const result = await this.questionRepository.save(question);
    result.vote = [];

    if (userId) {
      const voteInfo = await this.voteService.getVote({
        user: { id: userId },
        question: { id: questionId },
      });

      if (voteInfo) {
        result.vote.push(voteInfo);
      }
    }
    return result;
  }

  /**
   * update vote count.
   *
   * @param userId
   * @param questionVoteDto
   * @returns The question with an increased view count.
   * @throws NotFoundException if the question does not exist.
   */
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
}
