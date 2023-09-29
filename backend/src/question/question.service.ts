import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Question } from "./entity/question.entity";
import { CreateQuestionDto } from "./dto/create-question.dto";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { plainToClass } from "class-transformer";

@Injectable()
export class QuestionService {
  constructor(
    @Inject("QUESTION_REPOSITORY")
    private questionRepository: Repository<Question>,
  ) {}

  /**
   * Find questions based on pagination options.
   *
   * @param options - Pagination options.
   * @returns A paginated list of questions.
   */
  async find(options: IPaginationOptions): Promise<Pagination<Question>> {
    return paginate<Question>(this.questionRepository, options);
  }

  /**
   * Find a question by its ID.
   *
   * @param id - The ID of the question to find.
   * @returns The found question.
   * @throws NotFoundException if the question does not exist.
   */
  async findOneById(id: string) {
    const question = await this.questionRepository.findOneById(id);

    if (!question) {
      throw new NotFoundException(`There is no quiestion under id ${id}`);
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
    const product = await this.questionRepository.preload({
      id,
      ...questionTrans,
    });

    if (!product) {
      throw new NotFoundException(`There is no product under id ${id}`);
    }

    return this.questionRepository.save(product);
  }

  /**
   * Remove a question by its ID.
   *
   * @param id - The ID of the question to remove.
   * @returns The removed question.
   * @throws NotFoundException if the question does not exist.
   */
  async remove(id: string) {
    const product = await this.findOneById(id);
    return this.questionRepository.remove(product);
  }

  /**
   * Get a question by its ID and increase its view count.
   *
   * @param questionId - The ID of the question.
   * @returns The question with an increased view count.
   * @throws NotFoundException if the question does not exist.
   */
  async getAndIncreaseViewCount(questionId: string): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ["user"],
    });
    if (!question) {
      throw new NotFoundException("Question not found");
    }

    question.views += 1;
    return this.questionRepository.save(question);
  }
}
