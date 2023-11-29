import {
  BadRequestException,
  forwardRef,
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
import { NotificationService } from "../notification/notification.service";
import {
  notificationText,
  notificationTextDesc,
} from "../constants/notification.constants";
import { Role } from "../enums/role.enum";
import { QuestionState } from "../enums/question-state.enum";
import { QuestionTimeTypeEnum } from "src/enums/question-type.enum";
import { UsersService } from "src/users/users.service";
import { HistoryService } from "../history/history.service";
import { BookmarkService } from "../bookmark/bookmark.service";

@Injectable()
export class QuestionService {
  constructor(
    @Inject("QUESTION_REPOSITORY")
    private readonly questionRepository: Repository<Question>,
    private readonly voteService: VoteService,
    private readonly tagService: TagService,
    private readonly activityService: ActivityService,
    private readonly notificationService: NotificationService,
    private readonly userService: UsersService,
    private readonly historyService: HistoryService,
    @Inject(forwardRef(() => BookmarkService))
    private readonly bookmarkService: BookmarkService,
  ) {}

  /**
   * Find questions based on pagination options.
   *
   * @param query - Pagination options.
   * @param tagNames - The tag names to filter questions by.
   * @returns A paginated list of questions.
   */
  async find(query: PaginateQuery, tagNames: string, loginUser: any) {
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

    if (loginUser == null || loginUser.role == Role.USER) {
      queryBuilder.andWhere("question.state <> :state", {
        state: QuestionState.BLOCKED,
      });
    }

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
    question.updatedAt = new Date();
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
        relations: ["user", "tags", "comments", "comments.user"],
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

    const createVote = await this.voteService.voteQuestion(
      userId,
      questionVoteDto,
      question,
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

      const bookmark = await this.bookmarkService.checkQuestionIsBookmark(
        question.id,
        userId,
      );
      if (bookmark) {
        result["bookmarks"] = [bookmark];
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
      const activity = await this.activityService.create(
        ReputationActivityTypeEnum.CREATE_QUESTION,
        ObjectActivityTypeEnum.QUESTION,
        question.id,
        userId,
        userId,
      );
      await this.notificationService.create(
        notificationText.QUESTION.CREATE,
        notificationTextDesc.QUESTION.CREATE,
        userId,
        activity.id,
      );

      return question;
    } else {
      throw new BadRequestException(message.REPUTATION.NOT_ENOUGH);
    }
  }

  @Transactional()
  async updateWithActivity(
    id: string,
    questionDto: UpdateQuestionDto,
    oldQuestion: Question,
    userId: string,
  ) {
    const questionUpdate = await this.update(id, questionDto);
    const activity = await this.activityService.create(
      ReputationActivityTypeEnum.UPDATE_QUESTION,
      ObjectActivityTypeEnum.QUESTION,
      id,
      userId,
      oldQuestion.user.id,
    );

    await this.historyService.createQuestionHistory(oldQuestion, userId);

    if (userId != oldQuestion.user.id) {
      await this.notificationService.create(
        notificationText.QUESTION.UPDATE,
        notificationTextDesc.QUESTION.UPDATE,
        oldQuestion.user.id,
        activity.id,
      );
    }
    return questionUpdate;
  }

  /**
   * Update a question with activity.
   * @param question - The question to update.
   * @param userId - The ID of the user updating the question.
   */
  @Transactional()
  async removeWithActivity(question: Question, userId: string) {
    const questionId = question.id;
    const questionRemove = this.remove(question);
    const activity = await this.activityService.create(
      ReputationActivityTypeEnum.DELETE_QUESTION,
      ObjectActivityTypeEnum.QUESTION,
      questionId,
      userId,
      question.user.id,
    );
    await this.activityService.syncPointDelete(question.id, question.user.id);
    await this.notificationService.create(
      notificationText.QUESTION.DELETE,
      notificationTextDesc.QUESTION.DELETE,
      question.user.id,
      activity.id,
    );
    return questionRemove;
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

  @Transactional()
  async censoring(questionId: string, userId: string, state: QuestionState) {
    let mess, repu, noti, notiDesc;
    if (state == QuestionState.VERIFIED) {
      mess = message.QUESTION.VERIFIED;
      repu = ReputationActivityTypeEnum.VERIFY_QUESTION;
      noti = notificationText.QUESTION.VERIFY;
      notiDesc = notificationTextDesc.QUESTION.VERIFY;
    } else if (state == QuestionState.BLOCKED) {
      mess = message.QUESTION.BLOCKED;
      repu = ReputationActivityTypeEnum.BLOCK_QUESTION;
      noti = notificationText.QUESTION.BLOCK;
      notiDesc = notificationTextDesc.QUESTION.BLOCK;
    } else if (state == QuestionState.PENDING) {
      mess = message.QUESTION.PENDING;
      repu = ReputationActivityTypeEnum.UN_BLOCK_QUESTION;
      noti = notificationText.QUESTION.VERIFY;
      notiDesc = notificationTextDesc.QUESTION.UN_BLOCK;
    }

    const question = await this.findOneById(questionId);
    if (question.state == state) {
      throw new BadRequestException(mess);
    }

    question.state = state;
    const result = await this.questionRepository.save(question);

    const activity = await this.activityService.create(
      repu,
      ObjectActivityTypeEnum.QUESTION,
      questionId,
      userId,
      question.user.id,
    );
    await this.notificationService.create(
      noti,
      notiDesc,
      question.user.id,
      activity.id,
    );

    return result;
  }

  async getCountQuestionByTime(timeType: QuestionTimeTypeEnum) {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentQuarter = Math.ceil(currentMonth / 3);

    const queryBuilder = this.questionRepository.createQueryBuilder("question");
    switch (timeType) {
      case QuestionTimeTypeEnum.DAY:
        queryBuilder
          .where("YEAR(question.createdAt) = :year", { year: currentYear })
          .andWhere("MONTH(question.createdAt) = :month", {
            month: currentMonth,
          })
          .andWhere("DAY(question.createdAt) = :day", {
            day: currentDay,
          });
        break;
      case QuestionTimeTypeEnum.MONTH:
        queryBuilder
          .where("YEAR(question.createdAt) = :year", { year: currentYear })
          .andWhere("MONTH(question.createdAt) = :month", {
            month: currentMonth,
          });
        break;
      case QuestionTimeTypeEnum.QUARTER:
        queryBuilder
          .where("YEAR(question.createdAt) = :year", { year: currentYear })
          .andWhere("QUARTER(question.createdAt) = :quarter", {
            quarter: currentQuarter,
          });
        break;
      case QuestionTimeTypeEnum.YEAR:
        queryBuilder.where("YEAR(question.createdAt) = :year", {
          year: currentYear,
        });
        break;
      default:
        break;
    }
    return await queryBuilder.getCount();
  }

  async getCountQuestion() {
    return {
      data: {
        all: await this.questionRepository.count(),
        currentDay: await this.getCountQuestionByTime(QuestionTimeTypeEnum.DAY),
        currentMonth: await this.getCountQuestionByTime(
          QuestionTimeTypeEnum.MONTH,
        ),
        currentQuarter: await this.getCountQuestionByTime(
          QuestionTimeTypeEnum.QUARTER,
        ),
        currentYear: await this.getCountQuestionByTime(
          QuestionTimeTypeEnum.YEAR,
        ),
      },
    };
  }

  getTop5ByViews() {
    const queryBuilder = this.questionRepository
      .createQueryBuilder("question")
      .orderBy(`question.views`, "DESC")
      .limit(5);
    return queryBuilder.getMany();
  }

  getTop5ByVotes() {
    const queryBuilder = this.questionRepository
      .createQueryBuilder("question")
      .orderBy(`question.votes`, "DESC")
      .limit(5);
    return queryBuilder.getMany();
  }

  getTop5ByAnswers() {
    const queryBuilder = this.questionRepository
      .createQueryBuilder("question")
      .addSelect("COUNT(answer.id)", "answer_count")
      .leftJoin("question.answers", "answer")
      .groupBy("question.id")
      .orderBy("answer_count", "DESC")
      .limit(5);

    return queryBuilder.getMany();
  }

  async getQuestionHistory(query: PaginateQuery, questionId: string) {
    return this.historyService.getQuestionHistory(query, questionId);
  }

  @Transactional()
  async replaceTag(newTagId: string, oldTagId: string) {
    const tagToReplace = await this.tagService.findOne({ id: newTagId });

    if (!tagToReplace) {
      throw new NotFoundException(`Tag with ID ${newTagId} not found.`);
    }

    const oldTag = await this.tagService.findOne({ id: oldTagId });
    if (!oldTag) {
      throw new NotFoundException(`New tag with ID ${oldTagId} not found.`);
    }

    try {
      const questions = await this.questionRepository.query(
        `SELECT * FROM question_tag WHERE tag_id = '${oldTagId}'`,
      );

      for (const question of questions) {
        const check = await this.questionRepository.query(
          `SELECT count(*) as numberQuestion FROM question_tag WHERE question_id = '${question.question_id}' AND tag_id = '${newTagId}'`,
        );
        if (check[0].numberQuestion == 0) {
          await this.questionRepository.query(
            `UPDATE question_tag SET tag_id = '${newTagId}' WHERE question_id = '${question.question_id}' AND tag_id = '${oldTagId}'`,
          );
        } else {
          await this.questionRepository.query(
            `DELETE FROM question_tag WHERE question_id = '${question.question_id}' AND tag_id = '${newTagId}'`,
          );
        }
      }

      await this.tagService.remove(oldTag);
    } catch (error) {
      throw new BadRequestException(`Error replace tag`);
    }
    return tagToReplace;
  }

  async checkReport(questionId: string) {
    return await this.activityService.checkUndeleteQuestion(questionId);
  }

  async getCountReport(questionId: string) {
    return await this.activityService.countUnblockQuestion(questionId);
  }
}
