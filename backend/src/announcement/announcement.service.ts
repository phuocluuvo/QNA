import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
// import { User } from "../users/entity/users.entity";
// import { Activity } from "../activity/entity/activity.entity";
import { plainToClass } from "class-transformer";
import { message } from "../constants/message.constants";
// import { paginate, PaginateQuery } from "nestjs-paginate";
// import { notificationPagination } from "../config/pagination/notification-pagination";
import { Announcement } from "./entity/announcement.entity";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { UpdateAnnouncementDto } from "./dto/update-announcement.dto";
import { PaginateQuery, paginate } from "nestjs-paginate";
import { announcementPaginateConfig } from "src/config/pagination/announcement-pagination";

@Injectable()
export class AnnouncementService {
  constructor(
    @Inject("ANNOUNCEMENT_REPOSITORY")
    private readonly announcementRepository: Repository<Announcement>,
  ) {}

  /**
   * create announcement
   * @param announcementDto - announcement dto
   *
   */
  async create(announcementDto: CreateAnnouncementDto) {
    const announcement = plainToClass(Announcement, announcementDto);
    return this.announcementRepository.save(announcement);
  }

  /**
   * update announcement
   */
  async update(id: string, announcementDto: UpdateAnnouncementDto) {
    const announcementTrans = plainToClass(
      UpdateAnnouncementDto,
      announcementDto,
      {
        excludeExtraneousValues: true,
      },
    );
    const announcement = await this.announcementRepository.preload({
      id,
      ...announcementTrans,
    });

    if (!announcement)
      throw new NotFoundException(message.NOT_FOUND.ANNOUCEMENT);

    return this.announcementRepository.save(announcement);
  }

  /**
   * delete announcement
   */
  async delete(id: string) {
    const announcement = await this.announcementRepository.findOneById(id);
    if (!announcement)
      throw new NotFoundException(message.NOT_FOUND.ANNOUCEMENT);

    return this.announcementRepository.remove(announcement);
  }

  /**
   * Find all announcement
   */
  async getAll(query: PaginateQuery) {
    const queryBuidler =
      this.announcementRepository.createQueryBuilder("announcement");
    return paginate<Announcement>(
      query,
      queryBuidler,
      announcementPaginateConfig,
    );
  }

  /**
   * Find all announcement for user
   */
  async getAllForUser(query: PaginateQuery) {
    const queryBuilder = this.announcementRepository
      .createQueryBuilder("announcement")
      .where("announcement.expiration_date > :currentTime", {
        currentTime: new Date(),
      });
    return paginate<Announcement>(
      query,
      queryBuilder,
      announcementPaginateConfig,
    );
  }

  /**
   * Find one announcement
   */
  async getOne(id: string) {
    const announcement = await this.announcementRepository.findOneById(id);
    if (!announcement)
      throw new NotFoundException(message.NOT_FOUND.ANNOUCEMENT);

    return announcement;
  }
}
