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
import { ReputationService } from "../reputation/reputation.service";
import {
  ActivityReputationTypeEnum,
  ObjectReputationTypeEnum,
} from "../enums/reputation.enum";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class AnswerService {
  constructor(
    @Inject("ANSWER_REPOSITORY")
    private answerRepository: Repository<Answer>,
    private readonly voteService: VoteService,
    private readonly reputationService: ReputationService,
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
   * @param userId
   * @param answerVoteDto
   * @returns The question with an increased view count.
   * @throws NotFoundException if the question does not exist.
   */
  @Transactional()
  async updateVote(
    userId: string,
    answerVoteDto: VoteAnswerDto,
  ): Promise<Answer> {
    const answer = await this.findOneById(answerVoteDto.answer_id);

    if (!answer) {
      throw new NotFoundException(message.NOT_FOUND.ANSWER);
    }

    const createVote = await this.voteService.voteAnswer(userId, answerVoteDto);

    if (answerVoteDto.vote_type === VoteType.UPVOTE) {
      answer.votes += createVote;
    } else if (answerVoteDto.vote_type === VoteType.DOWNVOTE) {
      answer.votes -= createVote;
    }

    try {
      return this.answerRepository.save(answer);
    } catch (error) {
      throw new Error("Error updating vote");
    }
  }

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

  @Transactional()
  async createWithReputation(answerDto: CreateAnswerDto, userId: string) {
    const answer = await this.create(answerDto, userId);
    await this.reputationService.create(
      ActivityReputationTypeEnum.CREATE_ANSWER,
      ObjectReputationTypeEnum.ANSWER,
      answer.id,
      userId,
    );

    return answer;
  }

  @Transactional()
  async removeWithReputation(answer: Answer, userId: string) {
    await this.reputationService.create(
      ActivityReputationTypeEnum.DELETE_ANSWER,
      ObjectReputationTypeEnum.ANSWER,
      answer.id,
      userId,
    );
    await this.reputationService.syncPointDelete(answer.id, userId);
    return this.remove(answer);
  }

  @Transactional()
  async approveAnswerWithReputation(
    approveAnswerDto: ApproveAnswerDto,
    answer: Answer,
  ) {
    const answerApprove = await this.approveAnswer(approveAnswerDto);

    await this.reputationService.create(
      answerApprove.isApproved
        ? ActivityReputationTypeEnum.ACCEPT_ANSWER
        : ActivityReputationTypeEnum.UN_ACCEPT_ANSWER,
      ObjectReputationTypeEnum.ANSWER,
      answer.id,
      answer.user.id,
    );

    return answerApprove;
  }
}
