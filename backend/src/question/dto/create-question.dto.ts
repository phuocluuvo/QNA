import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CreateQuestionDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  @IsArray()
  tag_ids: string[];
}
