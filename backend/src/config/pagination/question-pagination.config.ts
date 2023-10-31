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
  searchableColumns: ["title", "content"],
  relations: ["user"],
  filterableColumns: {
    type: [FilterOperator.EQ],
  },
};
