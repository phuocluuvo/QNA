import { DataSource } from "typeorm";
import { Question } from "../entity/question.entity";
export declare const questionProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Question>;
    inject: string[];
}[];
