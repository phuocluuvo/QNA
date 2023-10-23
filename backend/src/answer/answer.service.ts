import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Answer } from "./entity/answer.entity";
import { CreateAnswerDto } from "./dto/create-answer.dto";
import { plainToClass } from "class-transformer";
import { UpdateAnswerDto } from "./dto/update-answer.dto";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { VoteAnswerDto } from "../vote/dto/vote-answer.dto";
import { VoteService } from "../vote/vote.service";
import { VoteType } from "../enums/vote-type.enum";

@Injectable()
export class AnswerService {
  constructor(
    @Inject("ANSWER_REPOSITORY")
    private answerRepository: Repository<Answer>,
    private readonly voteService: VoteService,
  ) {}

  /**
   * Find answers based on questionId and paginate the results.
   *
   * @param questionId - The ID of the question to filter answers.
   * @param options - Pagination options.
   * @returns Paginated list of answers.
   */
  async find(
    questionId: string,
    options: IPaginationOptions,
  ): Promise<Pagination<Answer>> {
    const queryBuilder = this.answerRepository.createQueryBuilder("answer");

    queryBuilder.innerJoinAndSelect("answer.user", "user");
    queryBuilder.innerJoinAndSelect("answer.question", "question");
    queryBuilder.where(questionId ? { question: { id: questionId } } : {});
    queryBuilder.orderBy("answer.isApproved", "DESC");
    return paginate<Answer>(queryBuilder, options);
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
      throw new NotFoundException(`There is no answer under id ${id}`);
    }
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
  async updateVote(
    userId: string,
    answerVoteDto: VoteAnswerDto,
  ): Promise<Answer> {
    const answer = await this.findOneById(answerVoteDto.answer_id);

    if (!answer) {
      throw new NotFoundException("Question not found");
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
}
