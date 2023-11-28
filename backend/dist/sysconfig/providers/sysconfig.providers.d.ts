import { DataSource } from "typeorm";
import { Sysconfig } from "../entity/sysconfig.entity";
export declare const sysconfigProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Sysconfig>;
    inject: string[];
}[];
