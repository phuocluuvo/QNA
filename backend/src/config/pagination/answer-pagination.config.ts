import { PaginateConfig } from "nestjs-paginate";
import { Answer } from "../../answer/entity/answer.entity";

export const answerPaginateConfig: PaginateConfig<Answer> = {
  sortableColumns: ["votes", "content", "createdAt", "updatedAt", "isApproved"],
  defaultSortBy: [["isApproved", "DESC"]],
  searchableColumns: ["content"],
};
