import { AnswerListType } from "./Answer.type";
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
  answerList?: AnswerListType;
}

interface PostList {
  postList: Array<PostType>;
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export type PostType = PartialBy<Post, "tags" | "images">;
export type PostListType = PostList;
