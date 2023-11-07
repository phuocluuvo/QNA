import { PaginateConfig } from "nestjs-paginate";
import { Tag } from "../../tag/entity/tag.entity";

export const tagPaginateConfig: PaginateConfig<Tag> = {
  sortableColumns: ["content", "createdAt", "updatedAt"],
  defaultSortBy: [["name", "ASC"]],
  searchableColumns: ["name", "content"],
};