import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Question } from "./entity/question.entity";
import { QuestionService } from "./question.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { Pagination } from "nestjs-typeorm-paginate";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard } from "../auth/guards/accessToken.guard";
import { Request } from "express";

@ApiTags("question")
@Controller("question")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  /**
   * Search and paginate questions.
   *
   * @param page The page number for pagination (default: 1).
   * @param limit The maximum number of items per page (default: 10, max: 100).
   * @returns Promise<Pagination<Question>> Paginated list of questions.
   */
  @ApiOperation({
    summary: "search paginate questions",
  })
  @Get()
  @UseGuards()
  find(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Question>> {
    limit = limit > 100 ? 100 : limit;
    return this.questionService.find({
      page,
      limit,
    });
  }

  /**
   * Get a question by its ID and increase its view count.
   *
   * @param id The ID of the question to retrieve.
   * @returns Promise<Question> The question with the specified ID.
   */
  @ApiOperation({
    summary: "get question",
  })
  @Get(":id")
  @UseGuards()
  async findOneById(@Param("id") id: string) {
    return this.questionService.getAndIncreaseViewCount(id);
  }

  /**
   * Create a new question.
   *
   * @param questionDto The data for creating a new question.
   * @param req The request object to access the authenticated user's ID.
   * @returns Promise<Question> The created question.
   */
  @ApiOperation({
    summary: "create question",
  })
  @Post()
  @UseGuards(AccessTokenGuard)
  create(
    @Body() questionDto: CreateQuestionDto,
    @Req() req: Request,
  ): Promise<Question> {
    const userId = req.user["sub"];
    return this.questionService.create(questionDto, userId);
  }

  /**
   * Update a question.
   *
   * @param id The ID of the question to update.
   * @param questionDto The data for updating the question.
   * @returns Promise<Question> The updated question.
   */
  @ApiOperation({
    summary: "update question",
  })
  @Patch(":id")
  @UseGuards(AccessTokenGuard)
  async update(
    @Param("id") id: string,
    @Body() questionDto: UpdateQuestionDto,
  ): Promise<Question> {
    return this.questionService.update(id, questionDto);
  }

  /**
   * Delete a question.
   *
   * @param id The ID of the question to delete.
   * @returns Promise<Question> The deleted question.
   */
  @ApiOperation({
    summary: "delete question",
  })
  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  async remove(@Param("id") id: string): Promise<Question> {
    return this.questionService.remove(id);
  }
}
