import { DataSource } from "typeorm";
import { Bookmark } from "../entity/bookmark.entity";
export declare const bookmarkProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Bookmark>;
    inject: string[];
}[];
