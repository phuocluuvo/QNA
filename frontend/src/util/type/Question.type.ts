import { AnswerListType } from "./Answer.type";
import { PartialBy } from "./CustomType";
import { TagType } from "./Tag.type";
import { UserType } from "./User.type";

interface Post {
  id: string | number;
  title: string;
  content: string;
  votes: number;
  answerNumber: number;
  views: number;
  images?: { url: string }[];
  createdAt: string;
  updatedDate: string;
  status: number;
  user: UserType;
  tags?: Array<TagType>;
  answerList?: AnswerListType;
}

interface QuestionList {
  items: Array<QuestionType>;
  meta: {
    currentPage: number;
    itemCount: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export type QuestionType = PartialBy<Post, "tags" | "images">;
export type QuestionListType = QuestionList;
