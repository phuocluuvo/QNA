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
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard } from "../auth/guards/accessToken.guard";
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
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { Role } from "../enums/role.enum";
import { TagState } from "../enums/tag-state.enum";
import { UpdateTagDto } from "./dto/update-tag.dto";

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

  @ApiOperation({
    summary: "verify tag",
  })
  @ApiBearerAuth()
  @Get("topTagUser/:userId")
  async topTagUserByUser(@Param("userId") userId: string) {
    return this.tagService.topTagUserByUser(userId);
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
  async findOneById(@Param("name") name: string) {
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
  async create(@Req() req: Request, @Body() tagDto: CreateTagDto) {
    const userId = req["user"]["sub"];
    const tag = await this.tagService.findOne({ name: tagDto.name });
    if (!tag) {
      return this.tagService.create(tagDto, userId);
    } else {
      throw new BadRequestException(message.EXISTED.TAG);
    }
  }

  /**
   * Update an existing tag.
   *
   * @param id - The ID of the answer to update.
   * @param tagDto
   * @returns The updated tag.
   */
  @ApiOperation({
    summary: "update tag",
  })
  @ApiBearerAuth()
  @Patch(":id")
  @UseGuards(AccessTokenGuard)
  async update(@Param("id") id: string, @Body() tagDto: UpdateTagDto) {
    const comment = await this.tagService.findOne({ id: id });

    if (!comment) {
      throw new NotFoundException(message.NOT_FOUND.TAG);
    }

    return this.tagService.update(id, tagDto);
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
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MONITOR)
  async remove(@Param("id") id: string) {
    const tag = await this.tagService.findOne({ id: id });

    if (!tag) {
      throw new NotFoundException(message.NOT_FOUND.COMMENT);
    }

    return this.tagService.remove(tag);
  }

  /**
   * verify for a tag.
   *
   * @param req - The request object.
   * @param tagId
   * @returns The result of the tag.
   */
  @ApiOperation({
    summary: "verify tag",
  })
  @ApiBearerAuth()
  @Get(":tagId/verify")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MONITOR)
  async verify(@Req() req: Request, @Param("tagId") tagId: string) {
    const userId = req["user"]["sub"];
    return this.tagService.censoring(tagId, userId, TagState.VERIFIED);
  }
}
