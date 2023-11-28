import { DataSource } from "typeorm";
import { Collection } from "../enity/collection.entity";
export declare const collectionProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Collection>;
    inject: string[];
}[];
