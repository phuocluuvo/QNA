import { DataSource } from "typeorm";
import { Notification } from "../entity/notification.entity";
export declare const notificationProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Notification>;
    inject: string[];
}[];
