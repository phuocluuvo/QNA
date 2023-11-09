import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Vote } from "./entity/vote.entity";
import { VoteQuestionDto } from "./dto/vote-question.dto";
import { VoteAnswerDto } from "./dto/vote-answer.dto";
import { ReputationService } from "../reputation/reputation.service";
import {
  ActivityReputationTypeEnum,
  ObjectReputationTypeEnum,
} from "../enums/reputation.enum";
import { VoteType } from "../enums/vote-type.enum";

@Injectable()
export class VoteService {
  constructor(
    @Inject("VOTE_REPOSITORY")
    private readonly voteRepository: Repository<Vote>,
    private readonly reputationService: ReputationService,
  ) {}

  async voteQuestion(
    userId: string,
    voteDto: VoteQuestionDto,
  ): Promise<number> {
    await this.reputationService.create(
      voteDto.vote_type == VoteType.UPVOTE
        ? ActivityReputationTypeEnum.UPVOTE
        : ActivityReputationTypeEnum.DOWNVOTE,
      ObjectReputationTypeEnum.VOTE_QUESTION,
      voteDto.question_id,
      userId,
    );
    return this.handleVote(userId, voteDto, true);
  }

  async voteAnswer(userId: string, voteDto: VoteAnswerDto): Promise<number> {
    await this.reputationService.create(
      voteDto.vote_type == VoteType.UPVOTE
        ? ActivityReputationTypeEnum.UPVOTE
        : ActivityReputationTypeEnum.DOWNVOTE,
      ObjectReputationTypeEnum.VOTE_ANSWER,
      voteDto.answer_id,
      userId,
    );
    return this.handleVote(userId, voteDto, false);
  }

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

  async getVote(query: any): Promise<Vote> {
    try {
      return this.voteRepository.findOne({
        where: query,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async saveVote(vote: any): Promise<Vote> {
    try {
      return await this.voteRepository.save(vote);
    } catch (error) {
      throw new Error(error);
    }
  }

  private convertToVote(userId: string, voteDto: any, isQuestion: boolean) {
    const trans = {};
    trans["voteType"] = voteDto.vote_type;
    trans["question"] = isQuestion ? voteDto.question_id : null;
    trans["answer"] = !isQuestion ? voteDto.answer_id : null;
    trans["user"] = userId;
    return trans;
  }
}
