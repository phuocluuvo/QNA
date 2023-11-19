type Bookmark = {
  createdAt: string;
  id: string;
  question: string;
  type: "question" | "answer";
  updatedAt: string;
  user: string;
};

export type BookmarkType = Bookmark;
