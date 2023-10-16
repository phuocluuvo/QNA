import { VoteType } from "../../enums/vote-type.enum";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";

export class VoteAnswerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  answer_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(VoteType)
  @Expose()
  vote_type: VoteType;
}
