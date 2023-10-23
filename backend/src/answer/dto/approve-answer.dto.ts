import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class ApproveAnswerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  question_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  answer_id: string;
}
