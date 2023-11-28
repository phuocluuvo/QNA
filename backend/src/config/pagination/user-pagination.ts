import { FilterOperator, PaginateConfig } from "nestjs-paginate";
import { User } from "../../users/entity/users.entity";

export const userPaginateConfig: PaginateConfig<User> = {
  sortableColumns: [
    "fullname",
    "username",
    "email",
    "role",
    "activityPoint",
    "createdAt",
    "updatedAt",
  ],
  searchableColumns: ["id", "fullname", "username", "email"],
  defaultSortBy: [["createdAt", "DESC"]],
  filterableColumns: {
    role: [FilterOperator.EQ],
    state: [FilterOperator.EQ],
  },
};
