import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CreateTagDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @Matches(/^\S*$/)
  @MaxLength(30)
  name: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(900)
  content: string;
}
