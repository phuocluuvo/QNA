import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
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
  @IsString({
    message: "Email must be a string",
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "password too weak",
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
