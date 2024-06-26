import { FilterOperator, PaginateConfig } from "nestjs-paginate";
import { Notification } from "../../notification/entity/notification.entity";

export const notificationPagination: PaginateConfig<Notification> = {
  sortableColumns: ["createdAt", "updatedAt"],
  defaultSortBy: [
    ["isAnnouncement", "DESC"],
    ["isRead", "DESC"],
    ["createdAt", "DESC"],
  ],
  relations: [
    "user",
    "activity",
    "activity.user",
    "activity.question",
    "activity.answer",
    "activity.comment",
    "activity.answer.question",
    "activity.comment.answer.question",
    "activity.comment.question",
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
