import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from "class-validator";
import { Role } from "../../enums/role.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "Username is required",
  })
  username: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "Fullname is required",
  })
  fullname: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  dob: Date;

  @ApiProperty()
  @IsString({
    message: "Email must be a string",
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Password too weak",
  })
  password: string;

  @ApiProperty({ enum: ["admin", "user"] })
  @IsNotEmpty({
    message: "Role is required",
  })
  role: Role;

  @ApiProperty()
  refreshToken: string;
}
