import { VOTE } from "@/API/constant/Vote.enum";
import { AnswerListType } from "./Answer.type";
import { PartialBy } from "./CustomType";
import { TagType } from "./Tag.type";
import { UserType } from "./User.type";

type VoteType = Array<{
  createdAt: string;
  id: string;
  updatedAt: string;
  voteType: VOTE;
}>;
interface Post {
  id: string;
  title: string;
  content: string;
  votes: number;
  countAnswer: number | string;
  views: number;
  images?: { url: string }[];
  createdAt: string;
  updatedDate: string;
  status: number;
  user: UserType;
  tags?: Array<TagType>;
  vote: VoteType;
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
