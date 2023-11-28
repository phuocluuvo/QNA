import { Repository } from "typeorm";
import { Notification } from "./entity/notification.entity";
import { NotificationDto } from "./dto/notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { PaginateQuery } from "nestjs-paginate";
export declare class NotificationService {
    private readonly notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    findByUserId(query: PaginateQuery, filter: string, userId: string): Promise<import("nestjs-paginate").Paginated<Notification>>;
    findAnnouncement(): Promise<Notification[]>;
    getBadgeNumber(userId: string): Promise<number>;
    findOneByIdUser(id: string, userId: string): Promise<Notification>;
    create(title: string, description: string, userId: string, activityId: string): Promise<Notification>;
    update(id: string, title: string, description: string): Promise<Notification>;
    delete(notification: Notification): Promise<Notification>;
    createAnnouncement(notificationDto: NotificationDto): Promise<NotificationDto & Notification>;
    updateAnnouncement(id: string, notificationDto: UpdateNotificationDto): Promise<Notification>;
    deleteAnnouncement(id: string): Promise<Notification>;
    readNotification(id: string): Promise<Notification>;
    readAllNotification(userId: string): Promise<boolean>;
}
