import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Question } from "./entity/question.entity";
import { QuestionService } from "./question.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard } from "../auth/guards/accessToken.guard";
import { Request } from "express";
import { Action } from "../enums/action.enum";
import { CaslAbilityFactory } from "../casl/casl-ability.factory";
import { VoteQuestionDto } from "../vote/dto/vote-question.dto";
import { PublicGuard } from "../auth/guards/public.guard";
import { message } from "../constants/message.constants";
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from "nestjs-paginate";
import { questionPaginateConfig } from "../config/pagination/question-pagination.config";
import { Role } from "../enums/role.enum";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { QuestionState } from "../enums/question-state.enum";

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
   * @returns Promise<Pagination<Question>> Paginated list of questions.
   * @param query
   * @param tagNames
   * @param req
   */
  @ApiOkPaginatedResponse(Question, questionPaginateConfig)
  @ApiPaginationQuery(questionPaginateConfig)
  @Get()
  @UseGuards(PublicGuard)
  find(
    @Paginate() query: PaginateQuery,
    @Query("filter.tags") tagNames: string,
    @Req() req: Request,
  ) {
    const user = req.user ? req.user : null;
    return this.questionService.find(query, tagNames, user);
  }

  @ApiOkPaginatedResponse(Question, questionPaginateConfig)
  @ApiPaginationQuery(questionPaginateConfig)
  @ApiOperation({
    summary: "related question",
  })
  @Get("/related")
  @UseGuards()
  async getRelated(
    @Paginate() query: PaginateQuery,
    @Query("tag_names") tagNames: string,
  ) {
    return this.questionService.related(query, tagNames);
  }

  @ApiOperation({
    summary: "related question",
  })
  @Get("/questionBalance")
  @UseGuards(AccessTokenGuard)
  async getQuestionBalance(@Req() req: Request) {
    return this.questionService.getQuestionBalance(req.user["sub"]);
  }

  /**
   * Get a question by its ID and increase its view count.
   *
   * @param id The ID of the question to retrieve.
   * @param req Login user
   * @returns Promise<Question> The question with the specified ID.
   */
  @ApiOperation({
    summary: "get question",
  })
  @Get(":id")
  @UseGuards(PublicGuard)
  async findOneById(@Param("id") id: string, @Req() req: Request) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    const question = await this.questionService.findOneById(id);
    if (
      question.state == QuestionState.BLOCKED &&
      !ability.can(Action.Update, question)
    ) {
      throw new ForbiddenException(message.NOT_FOUND.QUESTION);
    }
    return this.questionService.getQuestionAndIncreaseViewCount(
      id,
      req.user["sub"],
      req.ip,
    );
  }

  /**
   * Get a specific question history by its ID.
   * @param id
   * @param query
   */
  @ApiOperation({
    summary: "get question history",
  })
  @Get(":id/history")
  @UseGuards()
  async findHistory(@Param("id") id: string, @Paginate() query: PaginateQuery) {
    return this.questionService.getQuestionHistory(query, id);
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
    return this.questionService.createWithActivity(questionDto, userId);
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
      throw new NotFoundException(message.NOT_FOUND.QUESTION);
    }

    if (ability.can(Action.Update, question)) {
      return this.questionService.updateWithActivity(
        id,
        questionDto,
        question,
        req.user["sub"],
      );
    } else {
      throw new ForbiddenException(message.NOT_AUTHOR.QUESTION);
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
      throw new NotFoundException(message.NOT_FOUND.QUESTION);
    }

    if (ability.can(Action.Delete, question)) {
      return this.questionService.removeWithActivity(question, req.user["sub"]);
    } else {
      throw new ForbiddenException(message.NOT_AUTHOR.QUESTION);
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

  /**
   * verify for a question.
   *
   * @param req - The request object.
   * @param questionId
   * @returns The result of the vote.
   */
  @ApiOperation({
    summary: "verify question",
  })
  @ApiBearerAuth()
  @Get(":questionId/verify")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MONITOR)
  async verify(@Req() req: Request, @Param("questionId") questionId: string) {
    const userId = req.user["sub"];
    return this.questionService.censoring(
      questionId,
      userId,
      QuestionState.VERIFIED,
    );
  }

  /**
   * verify for a question.
   *
   * @param req - The request object.
   * @param questionId
   * @returns The result of the vote.
   */
  @ApiOperation({
    summary: "verify question",
  })
  @ApiBearerAuth()
  @Get(":questionId/block")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MONITOR)
  async block(@Req() req: Request, @Param("questionId") questionId: string) {
    const userId = req.user["sub"];
    return this.questionService.censoring(
      questionId,
      userId,
      QuestionState.BLOCKED,
    );
  }

  /**
   * undelete for a question.
   *
   * @param req - The request object.
   * @param questionId
   * @returns The result of the vote.
   */
  @ApiOperation({
    summary: "verify question",
  })
  @ApiBearerAuth()
  @Get(":questionId/unblock")
  @UseGuards(AccessTokenGuard)
  async undelete(@Req() req: Request, @Param("questionId") questionId: string) {
    const userId = req.user["sub"];
    const ability = this.caslAbilityFactory.createForUser(req.user);
    const question = await this.questionService.findOneById(questionId);

    if (!(await this.questionService.checkReport(question.id))) {
      throw new BadRequestException(message.CANNOT_UN_BLOCK_OVER_MANY_TIMES);
    }

    if (ability.can(Action.Delete, question)) {
      return this.questionService.censoring(
        questionId,
        userId,
        QuestionState.PENDING,
      );
    } else {
      throw new ForbiddenException(message.NOT_AUTHOR.QUESTION);
    }
  }

  @ApiOperation({
    summary: "get count unblock question",
  })
  @ApiBearerAuth()
  @Get(":questionId/getCountUnblock")
  @UseGuards(AccessTokenGuard)
  async getCounUnBlock(@Param("questionId") questionId: string) {
    return await this.questionService.getCountReport(questionId);
  }

  @Put("replaceTag")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MONITOR)
  async replaceTag(
    @Body("tag_to_replace") newTag: string,
    @Body("old_tag") oldTag: string,
  ) {
    return this.questionService.replaceTag(newTag, oldTag);
  }
}
