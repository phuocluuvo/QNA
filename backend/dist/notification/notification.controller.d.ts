import { NotificationService } from "./notification.service";
import { NotificationDto } from "./dto/notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { PaginateQuery } from "nestjs-paginate/lib/decorator";
import { Notification } from "./entity/notification.entity";
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getNotifications(query: PaginateQuery, filter: string, req: Request): Promise<import("nestjs-paginate").Paginated<Notification>>;
    getBadgeNumber(req: Request): Promise<number>;
    getAnnouncement(): Promise<Notification[]>;
    readAllNotification(req: Request): Promise<boolean>;
    readNotification(req: Request, id: string): Promise<Notification>;
    createAnnouncement(req: Request, notificationDto: NotificationDto): Promise<NotificationDto & Notification>;
    updateAnnouncement(req: Request, notificationDto: UpdateNotificationDto, id: string): Promise<Notification>;
    deleteAnnouncement(req: Request, id: string): Promise<Notification>;
}
