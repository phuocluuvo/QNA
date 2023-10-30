import { Status } from "./Status.type";

interface Tag {
  id: string | number;
  name?: string;
  totalQuestion?: number;
  content?: string;
  status?: Status;
}

export type TagType = Tag;
