import { DataSource } from "typeorm";
import { Bookmark } from "../entity/bookmark.entity";

export const bookmarkProviders = [
  {
    provide: "BOOKMARK_REPOSITORY",
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Bookmark),
    inject: ["DATA_SOURCE"],
  },
];
