import { DataSource } from "typeorm";
import { Activity } from "../entity/activity.entity";
export declare const activityProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Activity>;
    inject: string[];
}[];
