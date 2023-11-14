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

  async findByUserId(query: PaginateQuery, userId: string) {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder("notification")
      .where("notification.user.id = :userId", { userId })
      .orWhere("notification.isAnnouncement = true");

    return paginate<Notification>(query, queryBuilder, notificationPagination);
  }

  async findAnnouncement() {
    return this.notificationRepository.find({
      where: { isAnnouncement: true },
    });
  }

  async findOneByIdUser(id: string, userId: string) {
    return this.notificationRepository.findOne({
      where: { id, user: { id: userId } },
    });
  }

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

  async update(id: string, title: string, description: string) {
    const notification = await this.notificationRepository.preload({
      id,
      title,
      description,
    });
    return this.notificationRepository.save(notification);
  }

  async delete(notification: Notification) {
    return this.notificationRepository.remove(notification);
  }

  async createAnnouncement(notificationDto: NotificationDto) {
    const notificationTrans = plainToClass(NotificationDto, notificationDto, {
      excludeExtraneousValues: true,
    });
    notificationTrans["isAnnouncement"] = true;
    return this.notificationRepository.save(notificationTrans);
  }

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

  async deleteAnnouncement(id: string) {
    const announcement = await this.notificationRepository.findOneById(id);
    if (!announcement)
      throw new NotFoundException(message.NOT_FOUND.NOTIFICATION);

    return this.notificationRepository.remove(announcement);
  }

  async readNotification(id: string) {
    const notification = await this.notificationRepository.preload({
      id,
      isRead: true,
    });
    return this.notificationRepository.save(notification);
  }
}
