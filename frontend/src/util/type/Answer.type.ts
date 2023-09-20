import { UserType } from "./User.type";

interface Answer {
  id: string | number;
  content: string;
  voteNumber: number;
  createdDate: string;
  updatedDate: string;
  status: number;
  user: UserType;
}

interface AnswerList {
  answerList: Array<AnswerType>;
  pagination: {
    currentPage: number;
    totalPageNumber: number;
  };
}

export type AnswerType = Answer;
export type AnswerListType = AnswerList;
