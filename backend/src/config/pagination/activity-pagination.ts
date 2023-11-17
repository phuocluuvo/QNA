import { PaginateConfig } from "nestjs-paginate";
import { Activity } from "../../activity/entity/activity.entity";

export const activityPaginateConfig: PaginateConfig<Activity> = {
  sortableColumns: ["createdAt", "updatedAt"],
  defaultSortBy: [["createdAt", "DESC"]],
  relations: ["user", "question", "answer", "comment", "answer.question"],
};
