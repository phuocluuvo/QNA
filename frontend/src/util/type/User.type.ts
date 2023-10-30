import { Status } from "./Status.type";

interface User {
  id: string;
  fullname: string;
  email: string;
  dob?: string;
  status?: Status;
  avatar?: string;
  updateAt?: string;
  createAt?: string;
  username: string;
}

export type UserType = User;
