import {
  IsDate,
  IsEmail,
  IsNotEmpty, IsOptional,
  IsString, IsUrl, Length,
  Matches, Max,
  MinLength,
} from "class-validator";
import { Role } from "../../enums/role.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "Username is required",
  })
  @Length(6, 20, { message: 'Username length must be between 6 and 20 characters' })
  username: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "Fullname is required",
  })
  @Length(6, 50, { message: 'Fullname length must be between 6 and 50 characters' })
  fullname: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  avatar: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  dob: Date;

  @ApiProperty()
  @IsNotEmpty({
    message: "Email is required",
  })
  @IsString({
    message: "Email must be a string",
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "Password is required",
  })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Password too weak",
  })
  password: string;

  @ApiProperty()
  refreshToken: string;
}
