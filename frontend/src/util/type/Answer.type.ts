import { QuestionType } from "./Question.type";
import { UserType } from "./User.type";

interface Answer {
  id: string;
  content: string;
  votes: number;
  createdAt: string;
  updatedAt: string;
  status: number;
  user: UserType;
  question: QuestionType;
  isApproved: boolean;
}

interface AnswerList {
  items: Array<AnswerType>;
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export type AnswerType = Answer;
export type AnswerListType = AnswerList;
