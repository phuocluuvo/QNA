import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { UserState } from "../../enums/user-state.enum";
import { Role } from "../../enums/role.enum";

export class CreateUserAdminDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty({
    message: "Username is required",
  })
  @Length(6, 20, {
    message: "Username length must be between 6 and 20 characters",
  })
  username: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty({
    message: "Fullname is required",
  })
  @Length(6, 50, {
    message: "Fullname length must be between 6 and 50 characters",
  })
  fullname: string;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsUrl()
  avatar: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty({
    message: "Email is required",
  })
  @IsString({
    message: "Email must be a string",
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @Expose()
  @IsOptional()
  title: string;

  //Social links
  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsUrl()
  facebookLink: string;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsUrl()
  githubLink: string;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsUrl()
  twitterLink: string;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsUrl()
  websiteLink: string;
  //

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsDate()
  dob: Date;

  @ApiProperty()
  @Expose()
  @IsNotEmpty({
    message: "Password is required",
  })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Password too weak",
  })
  password: string;

  @Expose()
  @IsOptional()
  @ApiProperty()
  @IsEnum(UserState)
  state: UserState;

  @Expose()
  @ApiProperty()
  @IsEnum(Role)
  role: Role;
}
