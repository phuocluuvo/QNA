import { DataSource } from "typeorm";
import { History } from "../entity/history.entity";
export declare const historyProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<History>;
    inject: string[];
}[];
