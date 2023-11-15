import {
  HISTORY_ACTIVITY_TYPE,
  OBJECT_ACTIVITY_TYPE,
} from "./HistoryActivity.enum";

type HistoryActivity = {
  activityType: HISTORY_ACTIVITY_TYPE;
  createdAt: string;
  id: string;
  objectId: string;
  objectType: OBJECT_ACTIVITY_TYPE;
  pointChange: 2;
  updatedAt: string;
};

interface HistoryActivityList {
  data: Array<HistoryActivity>;
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
export type HistoryActivityType = HistoryActivity;
export type HistoryActivityListType = HistoryActivityList;
