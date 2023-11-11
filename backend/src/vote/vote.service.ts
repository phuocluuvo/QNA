import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Vote } from "./entity/vote.entity";
import { VoteQuestionDto } from "./dto/vote-question.dto";
import { VoteAnswerDto } from "./dto/vote-answer.dto";
import { ActivityService } from "../activity/activity.service";
import { VoteType } from "../enums/vote-type.enum";
import {
  ReputationActivityTypeEnum,
  ObjectActivityTypeEnum,
} from "../enums/reputation.enum";

@Injectable()
export class VoteService {
  constructor(
    @Inject("VOTE_REPOSITORY")
    private readonly voteRepository: Repository<Vote>,
    private readonly activityService: ActivityService,
  ) {}

  /**
   * Vote question
   * @param userId
   * @param voteDto
   */
  async voteQuestion(
    userId: string,
    voteDto: VoteQuestionDto,
  ): Promise<number> {
    await this.activityService.create(
      voteDto.vote_type == VoteType.UPVOTE
        ? ReputationActivityTypeEnum.UPVOTE
        : ReputationActivityTypeEnum.DOWNVOTE,
      ObjectActivityTypeEnum.VOTE_QUESTION,
      voteDto.question_id,
      userId,
    );
    return this.handleVote(userId, voteDto, true);
  }

  /**
   * Vote answer
   * @param userId
   * @param voteDto
   */
  async voteAnswer(userId: string, voteDto: VoteAnswerDto): Promise<number> {
    await this.activityService.create(
      voteDto.vote_type == VoteType.UPVOTE
        ? ReputationActivityTypeEnum.UPVOTE
        : ReputationActivityTypeEnum.DOWNVOTE,
      ObjectActivityTypeEnum.VOTE_ANSWER,
      voteDto.answer_id,
      userId,
    );
    return this.handleVote(userId, voteDto, false);
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
}
