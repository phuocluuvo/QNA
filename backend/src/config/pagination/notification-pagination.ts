import { PaginateConfig } from "nestjs-paginate";
import { Notification } from "../../notification/entity/notification.entity";

export const notificationPagination: PaginateConfig<Notification> = {
  sortableColumns: ["createdAt", "updatedAt"],
  defaultSortBy: [
    ["isAnnouncement", "DESC"],
    ["createdAt", "ASC"],
  ],
};
