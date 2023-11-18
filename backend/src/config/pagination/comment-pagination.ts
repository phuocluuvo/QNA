import { FilterOperator, PaginateConfig } from "nestjs-paginate";
import { Comment } from "../../comment/entity/comment.entity";

export const commentPaginateConfig: PaginateConfig<Comment> = {
  sortableColumns: ["content", "createdAt", "updatedAt"],
  defaultSortBy: [["createdAt", "ASC"]],
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
