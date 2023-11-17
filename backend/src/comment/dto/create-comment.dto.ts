import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CreateCommentDto {
  @IsOptional()
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  answer_id: string;

  @IsOptional()
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  question_id: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  content: string;
}
