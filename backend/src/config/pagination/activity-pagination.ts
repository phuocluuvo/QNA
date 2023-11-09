import { PaginateConfig } from "nestjs-paginate";
import { Reputation } from "../../reputation/entity/reputation.entity";

export const reputationPaginateConfig: PaginateConfig<Reputation> = {
  sortableColumns: ["createdAt", "updatedAt"],
  defaultSortBy: [["createdAt", "DESC"]],
};
