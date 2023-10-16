import { Status } from "./Status.type";

interface User {
  id: number;
  fullname?: string;
  email: string;
  dob?: string;
  status?: Status;
  avatar?: string;
  password: string;
}

export type UserType = User;
