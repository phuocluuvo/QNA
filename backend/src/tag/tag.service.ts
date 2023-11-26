import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { Tag } from "./entity/tag.entity";
import { message } from "../constants/message.constants";
import { CreateTagDto } from "./dto/create-tag.dto";
import { plainToClass } from "class-transformer";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { paginate, PaginateQuery } from "nestjs-paginate";
import { tagPaginateConfig } from "../config/pagination/tag-pagination.config";
import { TagState } from "../enums/tag-state.enum";
import {
  ObjectActivityTypeEnum,
  ReputationActivityTypeEnum,
} from "../enums/reputation.enum";
import { ActivityService } from "../activity/activity.service";
import {
  notificationText,
  notificationTextDesc,
} from "../constants/notification.constants";
import { NotificationService } from "../notification/notification.service";
import { Transactional } from "typeorm-transactional";
import { Role } from "../enums/role.enum";

@Injectable()
export class TagService {
  constructor(
    @Inject("TAG_REPOSITORY")
    private readonly tagRepository: Repository<Tag>,
    private readonly activityService: ActivityService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * List tag.
   *
   * @returns Paginated list of tag.
   * @param query
   * @param user
   */
  async find(query: PaginateQuery, user: any) {
    const queryBuilder = this.tagRepository.createQueryBuilder("tag");

    if (!(user.role == Role.ADMIN || user.role == Role.MONITOR)) {
      queryBuilder.where({ state: TagState.VERIFIED });
    }
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
  async create(tagDto: CreateTagDto, userId: string) {
    const tagTrans = plainToClass(CreateTagDto, tagDto, {
      excludeExtraneousValues: true,
    });
    tagTrans["user"] = userId;
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

  @Transactional()
  async censoring(tagId: string, userId: string, state: TagState) {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
      relations: ["user"],
    });

    if (!tag) {
      throw new NotFoundException(message.NOT_FOUND.TAG);
    }

    if (tag.state == state) {
      throw new BadRequestException(message.TAG.VERIFIED);
    }
    tag.state = state;

    const result = await this.tagRepository.save(tag);
    const activity = await this.activityService.create(
      ReputationActivityTypeEnum.VERIFY_TAG,
      ObjectActivityTypeEnum.TAG,
      tagId,
      userId,
      tag.user.id,
    );
    await this.notificationService.create(
      notificationText.TAG.VERIFY,
      notificationTextDesc.TAG.VERIFY,
      tag.user.id,
      activity.id,
    );

    return result;
  }

  getTop5HasMostQuestion() {
    const queryBuilder = this.tagRepository
      .createQueryBuilder("tag")
      .select([
        "tag.id as id",
        "tag.name as name",
        "tag.content as content",
        "tag.state as state",
        "tag.created_at as created_at",
        "tag.updated_at as updated_at",
      ])
      .addSelect("COUNT(tag.id)", "question_count")
      .leftJoin("question_tag", "question_tag", "question_tag.tag_id = tag.id")
      .groupBy("tag.id")
      .orderBy("question_count", "DESC")
      .limit(5);

    return queryBuilder.getRawMany();
  }

  async topTagUserByUser(userId: string) {
    const queryBuilder = this.tagRepository
      .createQueryBuilder("tag")
      .addSelect(["COUNT(tag.id) as tag_questionsNumber"])
      .leftJoin("tag.questions", "question")
      .leftJoin("question.user", "user")
      .where("user.id = :userId", { userId: userId })
      .groupBy("tag.id")
      .limit(10);
    return queryBuilder.getMany();
  }
}
