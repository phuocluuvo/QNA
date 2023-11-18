import { AnswerType } from "./Answer.type";
import { CommentType } from "./Comment.type";
import {
  HISTORY_ACTIVITY_TYPE,
  OBJECT_ACTIVITY_TYPE,
} from "./HistoryActivity.enum";
import { QuestionType } from "./Question.type";
import { UserType } from "./User.type";

type HistoryActivity = {
  activityType: HISTORY_ACTIVITY_TYPE;
  createdAt: string;
  id: string;
  objectId: string;
  objectType: OBJECT_ACTIVITY_TYPE;
  pointChange: 2;
  updatedAt: string;
  user: UserType;
  question?: QuestionType | null;
  answer?: AnswerType | null;
  comment?: CommentType | null;
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
