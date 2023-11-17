import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BookmarkService } from "./bookmark.service";
import { Paginate, PaginateQuery } from "nestjs-paginate";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { QuestionService } from "../question/question.service";
import { AnswerService } from "../answer/answer.service";
import { AccessTokenGuard } from "../auth/guards/accessToken.guard";
import { Action } from "../enums/action.enum";
import { message } from "../constants/message.constants";
import { CaslAbilityFactory } from "../casl/casl-ability.factory";

@Controller("bookmark")
@ApiTags("bookmark")
export class BookmarkController {
  constructor(
    private readonly bookmarkService: BookmarkService,
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async find(@Paginate() query: PaginateQuery, @Req() req: Request) {
    const userId = req["user"]["sub"];
    return this.bookmarkService.find(query, userId);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  async create(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @Req() req: Request,
  ) {
    if (
      (createBookmarkDto.answer_id && createBookmarkDto.question_id) ||
      (!createBookmarkDto.answer_id && !createBookmarkDto.question_id)
    ) {
      throw new BadRequestException(
        "Either answer_id or question_id should be provided, not both or none.",
      );
    }
    await this.answerService.findOneById(createBookmarkDto.answer_id);
    await this.questionService.findOneById(createBookmarkDto.question_id);

    return this.bookmarkService.create(createBookmarkDto, req["user"]["sub"]);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  async delete(@Param("id") id: string, @Req() req: Request) {
    const bookmark = await this.bookmarkService.findOneById(id);
    const ability = this.caslAbilityFactory.createForUser(req["user"]);

    if (ability.can(Action.Delete, bookmark)) {
      return this.bookmarkService.remove(bookmark);
    } else {
      throw new ForbiddenException(message.NOT_AUTHOR.COMMENT);
    }
  }
}
