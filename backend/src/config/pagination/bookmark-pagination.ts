import { PaginateConfig } from "nestjs-paginate";
import { Bookmark } from "../../bookmark/entity/bookmark.entity";

export const bookmarkPaginateConfig: PaginateConfig<Bookmark> = {
  sortableColumns: ["createdAt", "updatedAt"],
  defaultSortBy: [["createdAt", "DESC"]],
  relations: ["question", "answer", "answer.question"],
};
