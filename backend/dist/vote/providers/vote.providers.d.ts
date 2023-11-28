import { DataSource } from "typeorm";
import { Vote } from "../entity/vote.entity";
export declare const voteProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Vote>;
    inject: string[];
}[];
