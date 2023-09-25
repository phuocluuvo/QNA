import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Question } from "./entity/question.entity";
import { CreateQuestionDto } from "./dto/create-question.dto";
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from "nestjs-typeorm-paginate";
import { UpdateQuestionDto } from "./dto/update-question.dto";

@Injectable()
export class QuestionService {
  constructor(
    @Inject("QUESTION_REPOSITORY")
    private questionRepository: Repository<Question>,
  ) {}

  async find(options: IPaginationOptions): Promise<Pagination<Question>> {
    return paginate<Question>(this.questionRepository, options);
  }

  async findOneById(id: string) {
    const question = await this.questionRepository.findOneById(id);

    if (!question) {
      throw new NotFoundException(`There is no quiestion under id ${id}`);
    }
    return question;
  }

  async create(questionDto: CreateQuestionDto): Promise<Question> {
    const question = this.questionRepository.create(questionDto);
    return this.questionRepository.save(question);
  }

  async update(id: string, questionDto: UpdateQuestionDto) {
    const product = await this.questionRepository.preload({
      id,
      ...questionDto,
    });

    if (!product) {
      throw new NotFoundException(`There is no product under id ${id}`);
    }

    return this.questionRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOneById(id);
    return this.questionRepository.remove(product);
  }
}
