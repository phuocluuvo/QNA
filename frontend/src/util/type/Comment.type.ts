import { UserType } from "./User.type";

type Comment = {
  content: string;
  createdAt: string;
  id: string;
  updatedAt: string;
  user: UserType;
};

export type CommentType = Comment;
