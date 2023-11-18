import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateBookmarkDto {
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
}
