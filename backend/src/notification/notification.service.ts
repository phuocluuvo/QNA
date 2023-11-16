import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Notification } from "./entity/notification.entity";
import { User } from "../users/entity/users.entity";
import { Activity } from "../activity/entity/activity.entity";
import { NotificationDto } from "./dto/notification.dto";
import { plainToClass } from "class-transformer";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { message } from "../constants/message.constants";
import { paginate, PaginateQuery } from "nestjs-paginate";
import { notificationPagination } from "../config/pagination/notification-pagination";

@Injectable()
export class NotificationService {
  constructor(
    @Inject("NOTIFICATION_REPOSITORY")
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  /**
   * Find all notification
   * @param query - paginate query
   * @param userId - login user id
   */
  async findByUserId(query: PaginateQuery, filter: string, userId: string) {
    const queryBuidler =
      this.notificationRepository.createQueryBuilder("notification");
    queryBuidler.where({ user: { id: userId } });
    if (filter) {
      const isRead = filter === "true";
      queryBuidler.andWhere("notification.isRead = :isRead", {
        isRead: isRead,
      });
    }
    queryBuidler.orWhere({ isAnnouncement: true });
    return paginate<Notification>(query, queryBuidler, notificationPagination);
  }

  /**
   * Find all announcement
   */
  async findAnnouncement() {
    return this.notificationRepository.find({
      where: { isAnnouncement: true },
      relations: ["user"],
    });
  }

  /**
   * Find all announcement
   */
  async getBadgeNumber(userId: string) {
    return this.notificationRepository.count({
      where: { isRead: false, user: { id: userId } },
    });
  }

  /**
   * Find one notification by id
   * @param id - notification id
   * @param userId - login user id
   */
  async findOneByIdUser(id: string, userId: string) {
    return this.notificationRepository.findOne({
      where: { id, user: { id: userId } },
    });
  }

  /**
   * Find one notification by id
   * @param title - notification title
   * @param description - notification description
   * @param userId - created user id
   * @param activityId - activity id
   */
  async create(
    title: string,
    description: string,
    userId: string,
    activityId: string,
  ) {
    const notification = new Notification();
    notification.title = title;
    notification.description = description;
    notification.user = { id: userId } as unknown as User;
    notification.activity = { id: activityId } as unknown as Activity;
    return this.notificationRepository.save(notification);
  }

  /**
   * Update notification
   * @param id - notification id
   * @param title - notification title
   * @param description - notification description
   */
  async update(id: string, title: string, description: string) {
    const notification = await this.notificationRepository.preload({
      id,
      title,
      description,
    });
    return this.notificationRepository.save(notification);
  }

  /**
   * Delete notification
   * @param notification - notification entity
   */
  async delete(notification: Notification) {
    return this.notificationRepository.remove(notification);
  }

  /**
   *  Create announcement
   * @param notificationDto - notification dto
   */
  async createAnnouncement(notificationDto: NotificationDto) {
    const notificationTrans = plainToClass(NotificationDto, notificationDto, {
      excludeExtraneousValues: true,
    });
    notificationTrans["isAnnouncement"] = true;
    return this.notificationRepository.save(notificationTrans);
  }

  /**
   * Update announcement
   * @param id - notification id
   * @param notificationDto - notification dto
   */
  async updateAnnouncement(id: string, notificationDto: UpdateNotificationDto) {
    const notificationTrans = plainToClass(NotificationDto, notificationDto, {
      excludeExtraneousValues: true,
    });
    const notification = await this.notificationRepository.preload({
      id,
      ...notificationTrans,
    });

    if (!notification)
      throw new NotFoundException(message.NOT_FOUND.NOTIFICATION);

    return this.notificationRepository.save(notification);
  }

  /**
   * Delete announcement
   * @param id - notification id
   */
  async deleteAnnouncement(id: string) {
    const announcement = await this.notificationRepository.findOneById(id);
    if (!announcement)
      throw new NotFoundException(message.NOT_FOUND.NOTIFICATION);

    return this.notificationRepository.remove(announcement);
  }

  /**
   * Read notification
   * @param id - notification id
   */
  async readNotification(id: string) {
    const notification = await this.notificationRepository.preload({
      id,
      isRead: true,
    });
    return this.notificationRepository.save(notification);
  }

  /**
   * Read all notification
   * @param id - notification id
   */
  async readAllNotification(userId: string) {
    const result = this.notificationRepository
      .createQueryBuilder("nocification")
      .update(Notification)
      .set({ isRead: true })
      .where({ user: { id: userId } })
      .execute();

    if (result) {
      return true;
    } else {
      return false;
    }
  }
}
