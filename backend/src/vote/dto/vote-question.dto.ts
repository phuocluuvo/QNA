import { VoteType } from "../../enums/vote-type.enum";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";

export class VoteQuestionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  question_id: string;

  @ApiProperty({ enum: ["up_vote", "down_vote"] })
  @IsNotEmpty()
  @IsEnum(VoteType)
  @Expose()
  vote_type: VoteType;
}
