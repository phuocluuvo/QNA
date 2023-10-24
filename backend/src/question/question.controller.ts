import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
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
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard } from "../auth/guards/accessToken.guard";
import { Request } from "express";
import { Action } from "../enums/action.enum";
import { CaslAbilityFactory } from "../casl/casl-ability.factory";
import { VoteQuestionDto } from "../vote/dto/vote-question.dto";

@ApiTags("question")
@Controller("question")
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

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
  ): Promise<any> {
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
  @ApiBearerAuth()
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
   * @param req
   * @returns Promise<Question> The updated question.
   */
  @ApiOperation({
    summary: "update question",
  })
  @ApiBearerAuth()
  @Patch(":id")
  @UseGuards(AccessTokenGuard)
  async update(
    @Param("id") id: string,
    @Body() questionDto: UpdateQuestionDto,
    @Req() req: Request,
  ): Promise<Question> {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    const question = await this.questionService.findOneById(id);

    if (!question) {
      throw new NotFoundException(`There is no product under id ${id}`);
    }

    if (ability.can(Action.Update, question)) {
      return this.questionService.update(id, questionDto);
    } else {
      throw new ForbiddenException("Access Denied. Not author");
    }
  }

  /**
   * Delete a question.
   *
   * @param id The ID of the question to delete.
   * @param req get user login
   * @returns Promise<Question> The deleted question.
   */
  @ApiOperation({
    summary: "delete question",
  })
  @ApiBearerAuth()
  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  async remove(
    @Param("id") id: string,
    @Req() req: Request,
  ): Promise<Question> {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    const question = await this.questionService.findOneById(id);

    if (!question) {
      throw new NotFoundException(`There is no question under id ${id}`);
    }

    if (ability.can(Action.Delete, question)) {
      return this.questionService.remove(question);
    } else {
      throw new ForbiddenException("Access Denied. Not author");
    }
  }

  /**
   * Vote for a question.
   *
   * @param questionVoteDto
   * @param req - The request object.
   * @returns The result of the vote.
   */
  @ApiOperation({
    summary: "vote question",
  })
  @ApiBearerAuth()
  @Post("vote")
  @UseGuards(AccessTokenGuard)
  async vote(@Body() questionVoteDto: VoteQuestionDto, @Req() req: Request) {
    const userId = req.user["sub"];
    return this.questionService.updateVote(userId, questionVoteDto);
  }
}
