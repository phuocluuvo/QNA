import { FilterOperator, PaginateConfig } from "nestjs-paginate";
import { User } from "../../users/entity/users.entity";

export const userPaginateConfig: PaginateConfig<User> = {
  searchableColumns: ["id", "fullname", "username", "email"],
  sortableColumns: [
    "createdAt",
    "updatedAt",
    "fullname",
    "username",
    "email",
    "role",
    "activityPoint",
  ],
  filterableColumns: {
    role: [FilterOperator.EQ],
    state: [FilterOperator.EQ],
  },
};
