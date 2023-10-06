import { Role } from "../../enums/role.enum";
import { Expose } from "class-transformer";

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
  dob: Date;

  @Expose()
  email: string;

  @Expose()
  role: Role;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
