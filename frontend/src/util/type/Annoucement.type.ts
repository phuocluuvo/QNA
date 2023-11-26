type Announcement = {
  id: string;
  title: string;
  description: string;
  expiration_date: string;
  createdAt: string;
  updatedAt: string;
};

type AnnouncementList = {
  data: Announcement[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

export type AnnouncementType = Announcement;
export type AnnouncementListType = AnnouncementList;
