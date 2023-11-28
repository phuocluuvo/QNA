import { DataSource } from "typeorm";
import { Tag } from "../entity/tag.entity";
export declare const tagProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Tag>;
    inject: string[];
}[];
