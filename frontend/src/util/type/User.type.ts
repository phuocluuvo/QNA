import { Status } from "./Status.type";

interface User {
  id: number;
  name?: string;
  email?: string;
  dob?: string;
  status?: Status;
  avatar?: string;
}

export type UserType = User;
