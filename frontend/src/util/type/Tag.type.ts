import { Status } from "./Status.type";
import { UserType } from "./User.type";

interface Tag {
  id: string;
  name: string;
  questionsNumber: number;
  content?: string;
  state: "pending" | "verified" | "blocked";
  createdAt: string;
  updatedAt: string;
  user: UserType;
}
export type TagListType = {
  data: Array<Tag>;
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
};
export type TagType = Tag;
