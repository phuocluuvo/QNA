import { QuestionType } from "./Question.type";
import { UserType } from "./User.type";

type Bookmark = {
  createdAt: string;
  id: string;
  question: QuestionType;
  type: "question" | "answer";
  updatedAt: string;
  user: UserType;
  collection?: string;
};

type BookmarkList = {
  data: Array<Bookmark>;
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
};

export type BookmarkType = Bookmark;
export type BookmarkListType = BookmarkList;
