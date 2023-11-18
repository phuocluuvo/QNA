import { FilterOperator, PaginateConfig } from "nestjs-paginate";
import { Answer } from "../../answer/entity/answer.entity";

export const answerPaginateConfig: PaginateConfig<Answer> = {
  sortableColumns: ["votes", "content", "createdAt", "updatedAt", "isApproved"],
  defaultSortBy: [["isApproved", "DESC"]],
  searchableColumns: ["content"],
  filterableColumns: {
    createdAt: [
      FilterOperator.BTW,
      FilterOperator.LTE,
      FilterOperator.GTE,
      FilterOperator.LT,
      FilterOperator.GT,
    ],
    updatedAt: [
      FilterOperator.BTW,
      FilterOperator.LTE,
      FilterOperator.GTE,
      FilterOperator.LT,
      FilterOperator.GT,
    ],
  },
};
