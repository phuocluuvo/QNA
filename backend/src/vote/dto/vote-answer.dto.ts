import { VoteType } from "../../enums/vote-type.enum";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { Answer } from "../../answer/entity/answer.entity";

export class VoteAnswerDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsUUID()
  answer: Answer;

  @ApiProperty({ enum: ["up_vote", "down_vote"] })
  @IsNotEmpty()
  @IsEnum(VoteType)
  @Expose()
  voteType: VoteType;
}
