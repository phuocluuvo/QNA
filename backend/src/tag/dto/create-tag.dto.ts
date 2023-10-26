import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CreateTagDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  @MaxLength(300)
  content: string;
}
