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
  activityPoints: number;

  @Expose()
  dob: Date;

  @Expose()
  email: string;

  @Expose()
  role: Role;

  @Expose()
  state: UserState;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
