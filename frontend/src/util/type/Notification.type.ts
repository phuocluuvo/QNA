type Notification = {
  createdAt: string;
  description: string;
  id: string;
  isAnnouncement: Boolean;
  isRead: Boolean;
  title: string;
  updatedAt: string;
};

interface NotificationList {
  data: Array<Notification>;
  meta: {
    currentPage: number;
    itemCount: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
  links: {
    current: string;
    last: string;
    next: string;
  };
}

export type NotificationType = Notification;
export type NotificationListType = NotificationList;
