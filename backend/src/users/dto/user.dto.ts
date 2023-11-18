import { Role } from "../../enums/role.enum";
import { Expose } from "class-transformer";
import { UserState } from "../../enums/user-state.enum";

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  fullname: string;

  @Expose()
  avatar: string;

  @Expose()
  activityPoint: number;

  @Expose()
  dob: Date;

  @Expose()
  email: string;

  @Expose()
  title: string;

  //Social links
  @Expose()
  facebookLink: string;

  @Expose()
  githubLink: string;

  @Expose()
  twitterLink: string;

  @Expose()
  websiteLink: string;

  @Expose()
  role: Role;

  @Expose()
  state: UserState;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
