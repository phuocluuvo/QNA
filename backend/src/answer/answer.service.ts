import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Answer } from "./entity/answer.entity";
import { CreateAnswerDto } from "./dto/create-answer.dto";
import { plainToClass } from "class-transformer";
import { UpdateAnswerDto } from "./dto/update-answer.dto";
import { paginate, PaginateQuery } from "nestjs-paginate";
import { VoteAnswerDto } from "../vote/dto/vote-answer.dto";
import { VoteService } from "../vote/vote.service";
import { VoteType } from "../enums/vote-type.enum";
import { ApproveAnswerDto } from "./dto/approve-answer.dto";
import { message } from "../constants/message.constants";
import { answerPaginateConfig } from "../config/pagination/answer-pagination.config";
import { ActivityService } from "../activity/activity.service";
import { Transactional } from "typeorm-transactional";
import {
  ObjectActivityTypeEnum,
  ReputationActivityTypeEnum,
} from "../enums/reputation.enum";
import {
  notificationText,
  notificationTextDesc,
} from "../constants/notification.constants";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class AnswerService {
  constructor(
    @Inject("ANSWER_REPOSITORY")
    private readonly answerRepository: Repository<Answer>,
    private readonly voteService: VoteService,
    private readonly activityService: ActivityService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Find answers based on questionId and paginate the results.
   *
   * @param questionId - The ID of the question to filter answers.
   * @param userId
   * @param query
   * @returns Paginated list of answers.
   */
  async find(questionId: string, userId: string, query: PaginateQuery) {
    const queryBuilder = this.answerRepository.createQueryBuilder("answer");
    queryBuilder.leftJoinAndSelect("answer.user", "user");
    queryBuilder.leftJoinAndSelect("answer.question", "question");
    queryBuilder.leftJoinAndSelect(
      "answer.vote",
      "vote",
      "vote.user_id = :userId AND vote.answer_id = answer.id",
      { userId },
    );
    queryBuilder.leftJoinAndSelect("answer.comments", "comment");
    queryBuilder.leftJoinAndSelect("comment.user", "commentUser");

    queryBuilder.where(
      questionId ? { question: { id: questionId } } : { id: "no_id" },
    );
    return paginate<Answer>(query, queryBuilder, answerPaginateConfig);
  }

  /**
   * Find an answer by its ID.
   *
   * @param id - The ID of the answer to retrieve.
   * @returns The answer with the specified ID.
   * @throws NotFoundException if the answer with the given ID does not exist.
   */
  async findOneById(id: string) {
    const answer = await this.answerRepository.findOne({
      where: { id: id },
      relations: ["user", "question"],
    });

    if (!answer) {
      throw new NotFoundException(message.NOT_FOUND.ANSWER);
    }
    return answer;
  }

  /**
   * Find an answer.
   *
   * @param option - The option of the answer to retrieve.
   * @returns The answer with the specified ID.
   * @throws NotFoundException if the answer with the given ID does not exist.
   */
  async findOne(option: any) {
    const answer = await this.answerRepository.findOne({
      where: option,
      relations: ["user", "question"],
    });

    return answer;
  }

  /**
   * Create a new answer.
   *
   * @param answerDto - The data to create a new answer.
   * @param userId - The ID of the user creating the answer.
   * @returns The created answer.
   */
  async create(answerDto: CreateAnswerDto, userId: string) {
    const answerTrans = plainToClass(CreateAnswerDto, answerDto, {
      excludeExtraneousValues: true,
    });
    answerTrans["user"] = userId;
    answerTrans["question"] = answerDto.question_id;
    return this.answerRepository.save(answerTrans);
  }

  /**
   * Update an existing answer.
   *
   * @param id - The ID of the answer to update.
   * @param answerDto - The updated data for the answer.
   * @returns The updated answer.
   */
  async update(id: string, answerDto: UpdateAnswerDto) {
    const answerTrans = plainToClass(UpdateAnswerDto, answerDto, {
      excludeExtraneousValues: true,
    });
    const answer = await this.answerRepository.preload({
      id,
      ...answerTrans,
    });
    return this.answerRepository.save(answer);
  }

  /**
   * Remove an answer.
   *
   * @param answer - The answer entity to remove.
   * @returns The removed answer.
   */
  async remove(answer: Answer) {
    return this.answerRepository.remove(answer);
  }

  /**
   * update vote count.
   *
   * @param userId - The ID of the user to update.
   * @param answerVoteDto - The updated data for the answer.
   * @returns The question with an increased view count.
   * @throws NotFoundException if the question does not exist.
   */
  @Transactional()
  async updateVote(
    userId: string,
    answerVoteDto: VoteAnswerDto,
  ): Promise<Answer> {
    const answer = await this.findOneById(answerVoteDto.answer_id);

    const createVote = await this.voteService.voteAnswer(
      userId,
      answerVoteDto,
      answer,
    );

    if (answerVoteDto.vote_type === VoteType.UPVOTE) {
      answer.votes += createVote;
    } else if (answerVoteDto.vote_type === VoteType.DOWNVOTE) {
      answer.votes -= createVote;
    }
    return this.answerRepository.save(answer);
  }

  /**
   * Approve an answer.
   *
   * @param approveAnswerDto - The data to approve an answer.
   * @returns The approved answer.
   */
  async approveAnswer(approveAnswerDto: ApproveAnswerDto): Promise<Answer> {
    const exitApproved = await this.findOne({
      question: { id: approveAnswerDto.question_id },
      isApproved: true,
    });
    const answerTrans = new UpdateAnswerDto();

    if (exitApproved && exitApproved.id == approveAnswerDto.answer_id) {
      answerTrans["isApproved"] = false;
      return await this.update(approveAnswerDto.answer_id, answerTrans);
    } else if (exitApproved && exitApproved.id != approveAnswerDto.answer_id) {
      answerTrans["isApproved"] = false;
      await this.update(exitApproved.id, answerTrans);
    }

    answerTrans["isApproved"] = true;
    return await this.update(approveAnswerDto.answer_id, answerTrans);
  }

  /**
   * Create a new answer with activity.
   * @param answerDto - The data to create a new answer.
   * @param userId - The ID of the user creating the answer.
   */
  @Transactional()
  async createWithActivity(answerDto: CreateAnswerDto, userId: string) {
    const answer = await this.create(answerDto, userId);
    const activity = await this.activityService.create(
      ReputationActivityTypeEnum.CREATE_ANSWER,
      ObjectActivityTypeEnum.ANSWER,
      answer.id,
      userId,
      userId,
    );
    await this.notificationService.create(
      notificationText.ANSWER.CREATE,
      notificationTextDesc.ANSWER.CREATE,
      userId,
      activity.id,
    );
    return answer;
  }

  /**
   * Update an existing answer with activity.
   * @param id - The ID of the answer to update.
   * @param answerDto - The updated data for the answer.
   * @param oldAnswer
   * @param userId
   */
  @Transactional()
  async updateWithActivity(
    id: string,
    answerDto: UpdateAnswerDto,
    oldAnswer: Answer,
    userId: string,
  ) {
    const answerUpdate = await this.update(id, answerDto);
    const activity = await this.activityService.create(
      ReputationActivityTypeEnum.UPDATE_ANSWER,
      ObjectActivityTypeEnum.ANSWER,
      id,
      userId,
      oldAnswer.user.id,
    );
    if (userId != oldAnswer.user.id) {
      await this.notificationService.create(
        notificationText.ANSWER.UPDATE,
        notificationTextDesc.ANSWER.UPDATE,
        oldAnswer.user.id,
        activity.id,
      );
    }
    return answerUpdate;
  }

  /**
   * Remove an answer with activity.
   * @param answer - The answer entity to remove.
   * @param userId - The ID of the user removing the answer.
   */
  @Transactional()
  async removeWithActivity(answer: Answer, userId: string) {
    const answerId = answer.id;
    const answerRemove = await this.remove(answer);

    const activity = await this.activityService.create(
      ReputationActivityTypeEnum.DELETE_ANSWER,
      ObjectActivityTypeEnum.ANSWER,
      answerId,
      userId,
      answer.user.id,
    );

    await this.activityService.syncPointDelete(answer.id, answer.user.id);
    await this.notificationService.create(
      notificationText.ANSWER.DELETE,
      notificationTextDesc.ANSWER.DELETE,
      answer.user.id,
      activity.id,
    );
    return answerRemove;
  }

  /**
   * Approve an answer with activity.
   * @param approveAnswerDto - The data to approve an answer.
   * @param answer - The answer entity to approve.
   */
  @Transactional()
  async approveAnswerWithActivity(
    approveAnswerDto: ApproveAnswerDto,
    answer: Answer,
  ) {
    const answerApprove = await this.approveAnswer(approveAnswerDto);

    const activity = await this.activityService.create(
      answerApprove.isApproved
        ? ReputationActivityTypeEnum.ACCEPT_ANSWER
        : ReputationActivityTypeEnum.UN_ACCEPT_ANSWER,
      ObjectActivityTypeEnum.ANSWER,
      answer.id,
      answer.user.id,
      answer.user.id,
    );
    await this.notificationService.create(
      answerApprove.isApproved
        ? notificationText.ANSWER.ACCEPT
        : notificationText.ANSWER.UN_APPROVE,
      answerApprove.isApproved
        ? notificationTextDesc.ANSWER.ACCEPT
        : notificationTextDesc.ANSWER.UN_APPROVE,
      answer.user.id,
      activity.id,
    );

    return answerApprove;
  }
}
