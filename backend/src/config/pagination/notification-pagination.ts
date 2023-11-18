import { FilterOperator, PaginateConfig } from "nestjs-paginate";
import { Notification } from "../../notification/entity/notification.entity";

export const notificationPagination: PaginateConfig<Notification> = {
  sortableColumns: ["createdAt", "updatedAt"],
  defaultSortBy: [
    ["isAnnouncement", "DESC"],
    ["createdAt", "ASC"],
  ],
  relations: [
    "user",
    "activity",
    "activity.user",
    "activity.question",
    "activity.answer",
    "activity.comment",
  ],
  searchableColumns: ["title", "description"],
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
