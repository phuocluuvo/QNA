import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard } from "../auth/guards/accessToken.guard";
import { UpdateCommentDto } from "../comment/dto/update-comment.dto";
import { message } from "../constants/message.constants";
import { TagService } from "./tag.service";
import { CreateTagDto } from "./dto/create-tag.dto";
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from "nestjs-paginate";
import { Question } from "../question/entity/question.entity";
import { tagPaginateConfig } from "../config/pagination/tag-pagination.config";

@ApiTags("tag")
@Controller("tag")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /**
   * Get paginated tag.
   *
   * @returns Paginated list of tag.
   * @param query
   */
  @ApiOkPaginatedResponse(Question, tagPaginateConfig)
  @ApiPaginationQuery(tagPaginateConfig)
  @Get()
  @UseGuards()
  find(@Paginate() query: PaginateQuery) {
    return this.tagService.find(query);
  }

  /**
   * Get a specific tag by its name.
   *
   * @param name - The name of the comment to retrieve.
   * @returns The tag.
   */
  @ApiOperation({
    summary: "get tag by tag name ",
  })
  @Get(":name")
  @UseGuards()
  async findOneById(@Param("id") name: string) {
    return this.tagService.findOneByName(name);
  }

  /**
   * Create a new tag.
   *
   * @param tagDto - The data to create a new tag.
   * @returns The created tag.
   */
  @ApiOperation({
    summary: "create tag",
  })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AccessTokenGuard)
  async create(@Body() tagDto: CreateTagDto) {
    const tag = await this.tagService.findOne({ name: tagDto.name });

    if (!tag) {
      return this.tagService.create(tagDto);
    } else {
      throw new BadRequestException(message.EXISTED.TAG);
    }
  }

  /**
   * Update an existing tag.
   *
   * @param id - The ID of the answer to update.
   * @param commentDto - The updated data for the tag.
   * @returns The updated tag.
   */
  @ApiOperation({
    summary: "update answer",
  })
  @ApiBearerAuth()
  @Patch(":id")
  @UseGuards(AccessTokenGuard)
  async update(@Param("id") id: string, @Body() commentDto: UpdateCommentDto) {
    const comment = await this.tagService.findOne({ id: id });

    if (!comment) {
      throw new NotFoundException(message.NOT_FOUND.COMMENT);
    }

    return this.tagService.update(id, commentDto);
  }

  /**
   * Delete a tag.
   *
   * @param id - The ID of the answer to delete.
   * @returns The deleted comment.
   */
  @ApiOperation({
    summary: "delete tag",
  })
  @ApiBearerAuth()
  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  async remove(@Param("id") id: string) {
    const tag = await this.tagService.findOne({ id: id });

    if (!tag) {
      throw new NotFoundException(message.NOT_FOUND.COMMENT);
    }

    return this.tagService.remove(tag);
  }
}
