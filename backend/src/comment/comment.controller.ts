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
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AnswerService } from "../answer/answer.service";
import { CaslAbilityFactory } from "../casl/casl-ability.factory";
import { CommentService } from "./comment.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard } from "../auth/guards/accessToken.guard";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Action } from "../enums/action.enum";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { message } from "../constants/message.constants";
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from "nestjs-paginate";
import { Question } from "../question/entity/question.entity";
import { commentPaginateConfig } from "../config/pagination/comment-pagination";
import { QuestionService } from "../question/question.service";

@ApiTags("comment")
@Controller("comment")
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly answerService: AnswerService,
    private readonly questionService: QuestionService,
  ) {}

  /**
   * Get paginated answers based on the provided answerId.
   *
   * @param answerId - The ID of the question to filter comment.
   * @param query
   * @returns Paginated list of comment.
   */
  @ApiOkPaginatedResponse(Question, commentPaginateConfig)
  @ApiPaginationQuery(commentPaginateConfig)
  @Get()
  @UseGuards()
  find(@Query("answer_id") answerId: string, @Paginate() query: PaginateQuery) {
    return this.commentService.find(answerId, query);
  }

  /**
   * Get a specific comment by its ID.
   *
   * @param id - The ID of the comment to retrieve.
   * @returns The comment with the specified ID.
   */
  @ApiOperation({
    summary: "get comment",
  })
  @Get(":id")
  @UseGuards()
  async findOneById(@Param("id") id: string) {
    return this.commentService.findOneById(id);
  }

  /**
   * Create a new comment for a answer.
   *
   * @param answerDto - The data to create a new comment.
   * @param req - The request object.
   * @returns The created comment.
   */
  @ApiOperation({
    summary: "create answer",
  })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AccessTokenGuard)
  async create(@Body() answerDto: CreateCommentDto, @Req() req: Request) {
    const userId = req["user"]["sub"];
    if (
      (answerDto.answer_id && answerDto.question_id) ||
      (!answerDto.answer_id && !answerDto.question_id)
    ) {
      throw new BadRequestException(
        "Either answer_id or question_id should be provided, not both or none.",
      );
    }
    await this.answerService.findOneById(answerDto.answer_id);
    await this.questionService.findOneById(answerDto.question_id);

    return this.commentService.createWithActivity(answerDto, userId);
  }

  /**
   * Update an existing answer.
   *
   * @param id - The ID of the answer to update.
   * @param commentDto - The updated data for the comment.
   * @param req - The request object.
   * @returns The updated answer.
   */
  @ApiOperation({
    summary: "update answer",
  })
  @ApiBearerAuth()
  @Patch(":id")
  @UseGuards(AccessTokenGuard)
  async update(
    @Param("id") id: string,
    @Body() commentDto: UpdateCommentDto,
    @Req() req: Request,
  ) {
    const ability = this.caslAbilityFactory.createForUser(req["user"]);
    const comment = await this.commentService.findOneById(id);

    if (!comment) {
      throw new NotFoundException(message.NOT_FOUND.COMMENT);
    }

    if (ability.can(Action.Update, comment)) {
      return this.commentService.updateWithActivity(
        id,
        commentDto,
        comment,
        req["user"]["sub"],
      );
    } else {
      throw new ForbiddenException(message.NOT_AUTHOR.COMMENT);
    }
  }

  /**
   * Delete an comment.
   *
   * @param id - The ID of the answer to delete.
   * @param req - The request object.
   * @returns The deleted comment.
   */
  @ApiOperation({
    summary: "delete comment",
  })
  @ApiBearerAuth()
  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  async remove(@Param("id") id: string, @Req() req: Request) {
    const ability = this.caslAbilityFactory.createForUser(req["user"]);
    const comment = await this.commentService.findOneById(id);

    if (!comment) {
      throw new NotFoundException(message.NOT_FOUND.COMMENT);
    }

    if (ability.can(Action.Delete, comment)) {
      return this.commentService.removeWithActivity(
        comment,
        req["user"]["sub"],
      );
    } else {
      throw new ForbiddenException(message.NOT_AUTHOR.COMMENT);
    }
  }
}
