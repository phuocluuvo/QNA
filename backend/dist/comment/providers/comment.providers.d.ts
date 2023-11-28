import { DataSource } from "typeorm";
import { Comment } from "../entity/comment.entity";
export declare const commentProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Comment>;
    inject: string[];
}[];
