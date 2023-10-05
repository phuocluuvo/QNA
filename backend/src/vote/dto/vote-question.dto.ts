import { VoteType } from "../../enums/vote-type.enum";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { Question } from "../../question/entity/question.entity";

export class VoteQuestionDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsUUID()
  question: Question;

  @ApiProperty({ enum: ["up_vote", "down_vote"] })
  @IsNotEmpty()
  @IsEnum(VoteType)
  @Expose()
  voteType: VoteType;
}
