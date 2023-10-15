import { QuestionType } from "@/util/type/Question.type";

export type FormQuestion = {
  id: number | string;
};
export type FormCreateQuestion = {
  title: string;
  content: string;
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
