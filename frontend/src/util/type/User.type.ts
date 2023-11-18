import { Status } from "./Status.type";

interface User {
  id: string;
  fullname: string;
  email: string;
  dob?: string;
  status?: Status;
  avatar?: string;
  updatedAt: string;
  createdAt: string;
  username: string;
  activityPoint: number;
  role: "admin" | "user" | "monitor";
}

// github user type
export interface GithubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
  created_at: string;
  updated_at: string;
}
type UserList = {
  data: Array<User>;
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
export type UserType = User;
export type UserListType = UserList;
export type UserGithubType = GithubUser;
