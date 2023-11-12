import { Status } from "./Status.type";

interface Tag {
  id: string | number;
  name: string;
  questionsNumber: number;
  content?: string;
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
