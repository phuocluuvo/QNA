import { DataSource } from "typeorm";
import { Sysconfig } from "../entity/sysconfig.entity";

export const sysconfigProviders = [
  {
    provide: "SYSCONFIG_REPOSITORY",
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Sysconfig),
    inject: ["DATA_SOURCE"],
  },
];
