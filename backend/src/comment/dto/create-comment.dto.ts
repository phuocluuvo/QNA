import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CreateCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  answer_id: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  content: string;
}
