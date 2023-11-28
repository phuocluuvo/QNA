import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CreateSysconfigDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  createQuestion: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  updateQuestion: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  createAnswer: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  updateAnswer: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  createComment: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  updateComment: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  upVote: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  cancleUpVote: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  changeDownVoteToUpVote: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  acceptAnswer: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  deleteQuestion: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  deleteAnswer: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  deleteComment: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  downVote: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  cancleDownVote: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  changeUpVoteToDownVote: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  unAcceptAnswer: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  blockQuestion: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  unBlockQuestion: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  verifyQuestion: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  verifyTag: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  isUse: boolean;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  createQuestionDaily: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  questionCreatePointCheck: number;
}
