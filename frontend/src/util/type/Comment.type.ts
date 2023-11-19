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
};

export type CommentType = Comment;
