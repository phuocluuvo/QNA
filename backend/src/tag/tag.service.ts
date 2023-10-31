import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Tag } from "./entity/tag.entity";
import { message } from "../constants/message.constants";
import { CreateTagDto } from "./dto/create-tag.dto";
import { plainToClass } from "class-transformer";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { paginate, PaginateQuery } from "nestjs-paginate";
import { tagPaginateConfig } from "../config/pagination/tag-pagination.config";

@Injectable()
export class TagService {
  constructor(
    @Inject("TAG_REPOSITORY")
    private tagRepository: Repository<Tag>,
  ) {}

  /**
   * List tag.
   *
   * @returns Paginated list of tag.
   * @param query
   */
  async find(query: PaginateQuery) {
    const queryBuilder = this.tagRepository.createQueryBuilder("tag");
    queryBuilder.select([
      "tag.id",
      "tag.name",
      "tag.content",
      "tag.questionsNumber",
    ]);
    queryBuilder.leftJoin("tag.questions", "question");

    return await paginate<Tag>(query, queryBuilder, tagPaginateConfig);
  }

  /**
   * Find a tag by its name.
   *
   * @param name - The name of the tag to retrieve.
   * @returns The tag with the specified name.
   * @throws NotFoundException if the tag with the given name does not exist.
   */
  async findOneByName(name: string) {
    const comment = await this.tagRepository.findOne({
      where: { name: name },
    });

    if (!comment) {
      throw new NotFoundException(message.NOT_FOUND.TAG);
    }
    return comment;
  }

  /**
   * Find a tag.
   *
   * @param option - The option of the tag to retrieve.
   * @returns The comment with the specified name.
   * @throws NotFoundException if the tag with the given name does not exist.
   */
  async findOne(option: any) {
    return await this.tagRepository.findOne({
      where: option,
    });
  }

  /**
   * Create a new tag.
   *
   * @param tagDto - The data to create a new tag.
   * @returns The created tag.
   */
  async create(tagDto: CreateTagDto) {
    const tagTrans = plainToClass(CreateTagDto, tagDto, {
      excludeExtraneousValues: true,
    });

    return this.tagRepository.save(tagTrans);
  }

  /**
   * Update an existing tag.
   *
   * @param id - The ID of the answer to update.
   * @param tagDto - The updated data for the tag.
   * @returns The updated tag.
   */
  async update(id: string, tagDto: UpdateTagDto) {
    const tagTrans = plainToClass(UpdateTagDto, tagDto, {
      excludeExtraneousValues: true,
    });
    const tag = await this.tagRepository.preload({
      id,
      ...tagTrans,
    });
    return this.tagRepository.save(tag);
  }

  /**
   * Remove a tag.
   *
   * @param tag - The comment entity to remove.
   * @returns The removed tag.
   */
  async remove(tag: Tag) {
    return this.tagRepository.remove(tag);
  }

  async checkAndTransTags(tag_ids: string[]) {
    const tagPromises = tag_ids.map(async (id) => {
      const tagExists = await this.tagRepository.findOne({ where: { id: id } });
      if (!tagExists) {
        throw new NotFoundException(message.NOT_FOUND.TAG + ": " + id);
      } else {
        return tagExists;
      }
    });

    return await Promise.all(tagPromises);
  }
}
