import { AnswerType } from "./Answer.type";
import { QuestionType } from "./Question.type";
import { UserType } from "./User.type";

type Comment = {
  content: string;
  createdAt: string;
  id: string;
  updatedAt: string;
  user: UserType;
  answer?: AnswerType;
  question?: QuestionType;
  type: "normal" | "report" | "pending" | "undelete";
};

export type CommentType = Comment;
