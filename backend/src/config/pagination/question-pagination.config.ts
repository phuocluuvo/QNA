import { FilterOperator, PaginateConfig } from "nestjs-paginate";
import { Question } from "../../question/entity/question.entity";

export const questionPaginateConfig: PaginateConfig<Question> = {
  sortableColumns: [
    "title",
    "content",
    "views",
    "votes",
    "createdAt",
    "updatedAt",
  ],
  defaultSortBy: [["title", "ASC"]],
  searchableColumns: ["id", "title", "content", "user.username"],
  relations: ["user", "comments", "comments.user", "tags"],
  filterableColumns: {
    "user.id": [FilterOperator.EQ],
    type: [FilterOperator.EQ],
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
