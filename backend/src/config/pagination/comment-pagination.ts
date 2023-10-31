import { PaginateConfig } from "nestjs-paginate";
import { Comment } from "../../comment/entity/comment.entity";

export const commentPaginateConfig: PaginateConfig<Comment> = {
  sortableColumns: ["content", "createdAt", "updatedAt"],
  defaultSortBy: [["createdAt", "ASC"]],
};
