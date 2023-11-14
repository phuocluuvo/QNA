import {
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
import { CaslAbilityFactory } from "../casl/casl-ability.factory";
import { AnswerService } from "./answer.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Answer } from "./entity/answer.entity";
import { AccessTokenGuard } from "../auth/guards/accessToken.guard";
import { Request } from "express";
import { CreateAnswerDto } from "./dto/create-answer.dto";
import { QuestionService } from "../question/question.service";
import { UpdateAnswerDto } from "./dto/update-answer.dto";
import { Action } from "../enums/action.enum";
import { VoteAnswerDto } from "../vote/dto/vote-answer.dto";
import { ApproveAnswerDto } from "./dto/approve-answer.dto";
import { PublicGuard } from "../auth/guards/public.guard";
import { message } from "../constants/message.constants";
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from "nestjs-paginate";
import { Question } from "../question/entity/question.entity";
import { answerPaginateConfig } from "../config/pagination/answer-pagination.config";

@ApiTags("answer")
@Controller("answer")
export class AnswerController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly questionService: QuestionService,
  ) {}

  /**
   * Get paginated answers based on the provided questionId.
   *
   * @param questionId - The ID of the question to filter answers.
   * @param req - Get login user.
   * @param query
   * @returns Paginated list of answers.
   */
  @ApiOkPaginatedResponse(Question, answerPaginateConfig)
  @ApiPaginationQuery(answerPaginateConfig)
  @Get()
  @UseGuards(PublicGuard)
  find(
    @Query("question_id") questionId: string,
    @Req() req: Request,
    @Paginate() query: PaginateQuery,
  ) {
    const userId = req.user["sub"];
    return this.answerService.find(questionId, userId, query);
  }

  /**
   * Get a specific answer by its ID.
   *
   * @param id - The ID of the answer to retrieve.
   * @returns The answer with the specified ID.
   */
  @ApiOperation({
    summary: "get answer",
  })
  @Get(":id")
  @UseGuards()
  async findOneById(@Param("id") id: string) {
    return this.answerService.findOneById(id);
  }

  /**
   * Create a new answer for a question.
   *
   * @param answerDto - The data to create a new answer.
   * @param req - The request object.
   * @returns The created answer.
   */
  @ApiOperation({
    summary: "create answer",
  })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AccessTokenGuard)
  async create(@Body() answerDto: CreateAnswerDto, @Req() req: Request) {
    const userId = req.user["sub"];
    const question = await this.questionService.findOneById(
      answerDto.question_id,
    );
    if (question) {
      return this.answerService.createWithActivity(answerDto, userId);
    }
  }

  /**
   * Update an existing answer.
   *
   * @param id - The ID of the answer to update.
   * @param answerDto - The updated data for the answer.
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
    @Body() answerDto: UpdateAnswerDto,
    @Req() req: Request,
  ): Promise<Answer> {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    const answer = await this.answerService.findOneById(id);

    if (!answer) {
      throw new NotFoundException(message.NOT_FOUND.ANSWER);
    }

    if (ability.can(Action.Update, answer)) {
      return this.answerService.updateWithActivity(id, answerDto, answer);
    } else {
      throw new ForbiddenException(message.NOT_AUTHOR.ANSWER);
    }
  }

  /**
   * Delete an answer.
   *
   * @param id - The ID of the answer to delete.
   * @param req - The request object.
   * @returns The deleted answer.
   */
  @ApiOperation({
    summary: "delete answer",
  })
  @ApiBearerAuth()
  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  async remove(@Param("id") id: string, @Req() req: Request): Promise<Answer> {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    const answer = await this.answerService.findOneById(id);

    if (!answer) {
      throw new NotFoundException(message.NOT_FOUND.ANSWER);
    }

    if (ability.can(Action.Delete, answer)) {
      return this.answerService.removeWithActivity(answer, req.user["sub"]);
    } else {
      throw new ForbiddenException(message.NOT_AUTHOR.ANSWER);
    }
  }

  /**
   * Vote for an answer.
   *
   * @param answerVoteDto - The object containing information for voting on an answer.
   * @param req - The request object.
   * @returns The result of the vote.
   */
  @ApiOperation({
    summary: "vote answer",
  })
  @ApiBearerAuth()
  @Post("vote")
  @UseGuards(AccessTokenGuard)
  async vote(@Body() answerVoteDto: VoteAnswerDto, @Req() req: Request) {
    const userId = req.user["sub"];
    return this.answerService.updateVote(userId, answerVoteDto);
  }

  /**
   * Approve for an answer.
   *
   * @param approveAnswerDto
   * @param req - The request object.
   * @returns The result of the vote.
   */
  @ApiOperation({
    summary: "approve answer",
  })
  @ApiBearerAuth()
  @Post("approve")
  @UseGuards(AccessTokenGuard)
  async approve(
    @Body() approveAnswerDto: ApproveAnswerDto,
    @Req() req: Request,
  ): Promise<Answer> {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    //Check answer exist
    const answer = await this.answerService.findOneById(
      approveAnswerDto.answer_id,
    );

    //Check question exist
    const question = await this.questionService.findOneById(
      approveAnswerDto.question_id,
    );

    if (ability.can(Action.Update, question)) {
      return this.answerService.approveAnswerWithActivity(
        approveAnswerDto,
        answer,
      );
    } else {
      throw new ForbiddenException(message.NOT_AUTHOR.QUESTION);
    }
  }
}
