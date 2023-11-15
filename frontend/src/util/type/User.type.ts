import { Status } from "./Status.type";

interface User {
  id: string;
  fullname: string;
  email: string;
  dob?: string;
  status?: Status;
  avatar?: string;
  updatedAt?: string;
  createdAt?: string;
  username: string;
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

export type UserType = User;
export type UserGithubType = GithubUser;
