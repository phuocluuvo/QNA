import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { Role } from "../../enums/role.enum";

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsString()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "password too weak",
  })
  password: string;

  @IsString()
  @IsEnum(Role)
  @IsNotEmpty({
    message: "Role is required",
  })
  role: string;
}
