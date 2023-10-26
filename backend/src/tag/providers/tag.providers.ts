import { DataSource } from "typeorm";
import { Tag } from "../entity/tag.entity";

export const tagProviders = [
  {
    provide: "TAG_REPOSITORY",
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Tag),
    inject: ["DATA_SOURCE"],
  },
];
