import { PartialBy } from "./CustomType";
import { TagType } from "./Tag.type";
import { UserType } from "./User.type";

interface Post {
  id: string | number;
  title: string;
  content: string;
  voteNumber: number;
  answerNumber: number;
  viewsNumber: number;
  images?: { url: string }[];
  createdDate: string;
  updatedDate: string;
  status: number;
  user: UserType;
  tags?: Array<TagType>;
}

interface PostList {
  postList: Array<PostType>;
  pagination: {
    currentPage: number;
    totalPageNumber: number;
  };
}

export type PostType = PartialBy<Post, "tags" | "images">;
export type PostListType = PostList;
