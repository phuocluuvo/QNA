import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Answer } from "./entity/answer.entity";

@Injectable()
export class AnswerService {
  constructor(
    @Inject("ANSWER_REPOSITORY")
    private answerRepository: Repository<Answer>,
  ) {}

  async getAnswers(questionId: string): Promise<Answer[]> {
    return this.answerRepository.findBy({ questionId });
  }
}
