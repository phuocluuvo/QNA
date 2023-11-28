import { DataSource } from "typeorm";
import { Announcement } from "./entity/announcement.entity";
export declare const announcementProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Announcement>;
    inject: string[];
}[];
