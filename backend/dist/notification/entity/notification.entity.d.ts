import { User } from "../../users/entity/users.entity";
import { Activity } from "../../activity/entity/activity.entity";
export declare class Notification {
    id: string;
    title: string;
    description: string;
    isRead: boolean;
    isAnnouncement: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    activity: Activity;
}
