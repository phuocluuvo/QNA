import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "Username is required",
  })
  username: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "Password is required",
  })
  password: string;
}
