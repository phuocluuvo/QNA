import { Status } from "./Status.type";

interface Tag {
  id: string;
  name: string;
  questionsNumber: number;
  content?: string;
  state: "pending" | "verified" | "blocked";
  createdAt: string;
  updatedAt: string;
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
