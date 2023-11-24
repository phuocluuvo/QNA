import { PaginateConfig } from "nestjs-paginate";
import { Announcement } from "src/announcement/entity/announcement.entity";

export const announcementPaginateConfig: PaginateConfig<Announcement> = {
  sortableColumns: [
    "title",
    "description",
    "expiration_date",
    "createdAt",
    "updatedAt",
  ],
  searchableColumns: ["title"],
  defaultSortBy: [["createdAt", "DESC"]],
};
