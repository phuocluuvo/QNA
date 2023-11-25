import { FilterOperator, PaginateConfig } from "nestjs-paginate";
import { Tag } from "../../tag/entity/tag.entity";

export const tagPaginateConfig: PaginateConfig<Tag> = {
  sortableColumns: ["content", "createdAt", "updatedAt"],
  defaultSortBy: [["name", "ASC"]],
  searchableColumns: ["name", "content"],
  relations: ["user", "questions"],
  filterableColumns: {
    "user.id": [FilterOperator.EQ],
    state: [FilterOperator.EQ],
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
