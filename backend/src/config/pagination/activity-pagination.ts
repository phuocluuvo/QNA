import { FilterOperator, PaginateConfig } from "nestjs-paginate";
import { Activity } from "../../activity/entity/activity.entity";

export const activityPaginateConfig: PaginateConfig<Activity> = {
  sortableColumns: ["createdAt", "updatedAt"],
  defaultSortBy: [["createdAt", "DESC"]],
  relations: ["user", "question", "answer", "comment"],
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
