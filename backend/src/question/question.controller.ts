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
} from "@nestjs/common";
import { Question } from "./entity/question.entity";
import { QuestionService } from "./question.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { Pagination } from "nestjs-typeorm-paginate";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("question")
@Controller("question")
export class QuestionController {
  constructor(private readonly questionProvider: QuestionService) {}

  @ApiOperation({
    summary: "serach paginate questions",
  })
  @Get()
  find(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Question>> {
    limit = limit > 100 ? 100 : limit;
    return this.questionProvider.find({
      page,
      limit,
    });
  }

  @ApiOperation({
    summary: "get question",
  })
  @Get(":id")
  async findOneById(@Param("id") id: string) {
    return this.questionProvider.findOneById(id);
  }

  @ApiOperation({
    summary: "create question",
  })
  @Post()
  create(@Body() questionDto: CreateQuestionDto): Promise<Question> {
    return this.questionProvider.create(questionDto);
  }

  @ApiOperation({
    summary: "update question",
  })
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() questionDto: UpdateQuestionDto,
  ): Promise<Question> {
    return this.questionProvider.update(id, questionDto);
  }

  @ApiOperation({
    summary: "delete question",
  })
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Question> {
    return this.questionProvider.remove(id);
  }
}
