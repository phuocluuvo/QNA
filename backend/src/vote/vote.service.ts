import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Vote } from "./entity/vote.entity";
import { VoteQuestionDto } from "./dto/vote-question.dto";
import { VoteAnswerDto } from "./dto/vote-answer.dto";
import { ActivityService } from "../activity/activity.service";
import { VoteType } from "../enums/vote-type.enum";
import {
  ObjectActivityTypeEnum,
  ReputationActivityTypeEnum,
} from "../enums/reputation.enum";
import { NotificationService } from "../notification/notification.service";
import { Question } from "../question/entity/question.entity";
import { Answer } from "../answer/entity/answer.entity";
import {
  notificationText,
  notificationTextDesc,
} from "../constants/notification.constants";
import { message } from "../constants/message.constants";

@Injectable()
export class VoteService {
  constructor(
    @Inject("VOTE_REPOSITORY")
    private readonly voteRepository: Repository<Vote>,
    private readonly activityService: ActivityService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Vote question
   * @param userId
   * @param voteDto
   * @param question
   */
  async voteQuestion(
    userId: string,
    voteDto: VoteQuestionDto,
    question: Question,
  ): Promise<number> {
    if (userId == question.user.id)
      throw new BadRequestException(message.VOTE.NOT_VOTE_MY_SELF);

    const vote = await this.handleVote(userId, voteDto, true);
    const activity = await this.activityService.create(
      this.getReputationType(voteDto, vote),
      ObjectActivityTypeEnum.VOTE_QUESTION,
      voteDto.question_id,
      userId,
      question.user.id,
    );
    await this.notificationService.create(
      this.getSateVote(voteDto, vote, true),
      this.getSateVote(voteDto, vote, false),
      question.user.id,
      activity.id,
    );
    return vote;
  }

  /**
   * Vote answer
   * @param userId
   * @param voteDto
   * @param answer
   */
  async voteAnswer(
    userId: string,
    voteDto: VoteAnswerDto,
    answer: Answer,
  ): Promise<number> {
    if (userId == answer.user.id)
      throw new BadRequestException(message.VOTE.NOT_VOTE_MY_SELF);

    const vote = await this.handleVote(userId, voteDto, false);
    const activity = await this.activityService.create(
      this.getReputationType(voteDto, vote),
      ObjectActivityTypeEnum.VOTE_ANSWER,
      voteDto.answer_id,
      userId,
      answer.user.id,
    );
    await this.notificationService.create(
      this.getSateVote(voteDto, vote, true),
      this.getSateVote(voteDto, vote, false),
      answer.user.id,
      activity.id,
    );
    return vote;
  }

  /**
   *  Handle vote
   * @param userId
   * @param voteDto
   * @param isQuestion
   * @private
   */
  private async handleVote(
    userId: string,
    voteDto: any,
    isQuestion: boolean,
  ): Promise<number> {
    const vote = await this.getVote(
      isQuestion
        ? { user: { id: userId }, question: { id: voteDto.question_id } }
        : { user: { id: userId }, answer: { id: voteDto.answer_id } },
    );

    if (vote && vote.voteType == voteDto.vote_type) {
      await this.voteRepository.remove(vote);
      return -1;
    }

    if (vote) {
      vote.voteType = voteDto.vote_type;
      await this.saveVote(vote);
      return 2;
    } else {
      const voteTrans = this.convertToVote(userId, voteDto, isQuestion);
      const votePre = this.voteRepository.create(voteTrans);
      await this.saveVote(votePre);
      return 1;
    }
  }

  /**
   * Get vote
   * @param query
   */
  async getVote(query: any): Promise<Vote> {
    try {
      return this.voteRepository.findOne({
        where: query,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Save vote
   * @param vote
   */
  async saveVote(vote: any): Promise<Vote> {
    try {
      return await this.voteRepository.save(vote);
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Convert to vote
   * @param userId
   * @param voteDto
   * @param isQuestion
   * @private
   */
  private convertToVote(userId: string, voteDto: any, isQuestion: boolean) {
    const trans = {};
    trans["voteType"] = voteDto.vote_type;
    trans["question"] = isQuestion ? voteDto.question_id : null;
    trans["answer"] = !isQuestion ? voteDto.answer_id : null;
    trans["user"] = userId;
    return trans;
  }

  /**
   * Get state vote
   * @param voteDto
   * @param state
   * @param isTitle
   * @param isRepu
   */
  private getSateVote(voteDto: any, state: number, isTitle: boolean) {
    const voteText = isTitle
      ? notificationText.VOTE
      : notificationTextDesc.VOTE;

    if (voteDto.vote_type == VoteType.UPVOTE) {
      if (state == 1) {
        return voteText.UP;
      } else if (state == -1) {
        return voteText.CANCEL_UP;
      } else {
        return voteText.CHANGE_DOWN_TO_UP;
      }
    } else if (voteDto.vote_type == VoteType.DOWNVOTE) {
      if (state == -1) {
        return voteText.CANCEL_DOWN;
      } else if (state == 1) {
        return voteText.DOWN;
      } else {
        return voteText.CHANGE_UP_TO_DOWN;
      }
    }
  }

  private getReputationType(voteDto: any, state: number) {
    if (voteDto.vote_type == VoteType.UPVOTE) {
      if (state == 1) {
        return ReputationActivityTypeEnum.UPVOTE;
      } else if (state == -1) {
        return ReputationActivityTypeEnum.CANCLE_UPVOTE;
      } else {
        return ReputationActivityTypeEnum.CHANGE_DOWNVOTE_TO_UPVOTE;
      }
    } else if (voteDto.vote_type == VoteType.DOWNVOTE) {
      if (state == -1) {
        return ReputationActivityTypeEnum.CANCLE_DOWNVOTE;
      } else if (state == 1) {
        return ReputationActivityTypeEnum.DOWNVOTE;
      } else {
        return ReputationActivityTypeEnum.CHANGE_UPVOTE_TO_DOWNVOTE;
      }
    }
  }
}
