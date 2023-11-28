import { DataSource } from "typeorm";
import { Answer } from "../entity/answer.entity";
export declare const answerProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Answer>;
    inject: string[];
}[];
