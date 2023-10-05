import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Vote } from "./entity/vote.entity";
import { VoteQuestionDto } from "./dto/vote-question.dto";
import { plainToClass } from "class-transformer";
import { VoteAnswerDto } from "./dto/vote-answer.dto";

@Injectable()
export class VoteService {
  constructor(
    @Inject("VOTE_REPOSITORY")
    private voteRepository: Repository<Vote>,
  ) {}

  async voteQuestion(userId: string, voteDto: VoteQuestionDto): Promise<Vote> {
    return this.handleVote(userId, voteDto, true);
  }

  async voteAnswer(userId: string, voteDto: VoteAnswerDto): Promise<Vote> {
    return this.handleVote(userId, voteDto, false);
  }

  private convertToVoteDto(
    userId: string,
    voteDto: VoteAnswerDto | VoteQuestionDto,
    isQuestion: boolean,
  ) {
    const trans = isQuestion
      ? plainToClass(VoteQuestionDto, voteDto, {
          excludeExtraneousValues: true,
        })
      : plainToClass(VoteAnswerDto, voteDto, { excludeExtraneousValues: true });

    trans["user"] = userId;
    return trans;
  }

  private async handleVote(
    userId: string,
    voteDto: any,
    isQuestion: boolean,
  ): Promise<Vote> {
    try {
      const vote = await this.voteRepository.findOne({
        where: isQuestion
          ? { user: { id: userId }, question: voteDto.question }
          : { user: { id: userId }, answer: voteDto.answer },
      });

      const voteTrans = this.convertToVoteDto(userId, voteDto, isQuestion);

      if (vote && vote.voteType == voteDto.voteType) {
        throw new BadRequestException("User has already voted");
      } else {
        const votePre = await this.voteRepository.preload({
          id: vote ? vote.id : null,
          ...voteTrans,
        });
        return this.voteRepository.save(votePre);
      }
    } catch (error) {
      throw new Error(`Error creating/updating vote: ${error.message}`);
    }
  }
}
