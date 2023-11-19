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
  answersNumber: number | string;
  views: number;
  images?: { url: string }[];
  createdAt: string;
  updatedDate: string;
  status: number;
  user: UserType;
  tags?: Array<TagType>;
  /**
   * tag names use for question list only, ortherwise its not exist
   */
  tagNames?: Array<string>;
  vote: VoteType;
  type: "no_answer" | "no_approved" | "normal";
  state: "verified" | "blocked" | "pending";
}

interface QuestionList {
  data: Array<QuestionType>;
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
export enum QUESTION_SORT_BY {
  NO_ANSWER = "no_answer",
  NO_APPROVED = "no_approved",
  /**
   * Có trả lời, có approved
   */
  NORMAL = "normal",
}

export type QuestionType = PartialBy<Post, "tags" | "images">;
export type QuestionListType = QuestionList;
