import { PaginateConfig } from "nestjs-paginate";
import { History } from "../../history/entity/history.entity";

export const historyPaginateConfig: PaginateConfig<History> = {
  sortableColumns: ["createdAt", "updatedAt"],
  defaultSortBy: [["createdAt", "DESC"]],
  relations: ["user", "question", "answer", "comment"],
};
