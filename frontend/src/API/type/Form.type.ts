import { QuestionType } from "@/util/type/Question.type";
import { VOTE } from "../constant/Vote.enum";

export type FormQuestion = {
  id: number | string;
};
export type FormCreateQuestion = {
  title: string;
  content: string;
  tag_ids: Array<string>;
};
export type FromUserLogin = {
  username: string;
  password: string;
};
export type FormSignUp = {
  username: string;
  fullname: string;
  email: string;
  password: string;
};

export type FormCreateAnswer = {
  question_id: number | string;
  content: string;
};

export type FormGetAnswer = {
  question_id: number | string;
  page: number;
  limit: number;
};

export type FormVote = {
  question_id: number | string;
  vote_type: VOTE;
};

export type FormApproveAnswer = {
  question_id: string;
  answer_id: string;
};

export type FormVoteAnswer = {
  answer_id: string;
  vote_type: VOTE;
};

export type FormCommentAnswer = {
  answer_id?: string;
  question_id?: string;
  content: string;
};

export type FormCreateTag = {
  name: string;
  content: string;
};
export type FormGetProfile = {
  page: number;
  limit: number;
  sortBy:
    | "fullname"
    | "username"
    | "email"
    | "role"
    | "activityPoint"
    | "createdAt"
    | "updatedAt ";
  search: string;
  searchBy: "fullname" | "username" | "email";
};

export type FormUpdateProfile = {
  fullname?: string;
  email?: string;
  avatar?: string;
  title?: string;
  facebookLink?: string;
  twitterLink?: string;
  websiteLink?: string;
};
