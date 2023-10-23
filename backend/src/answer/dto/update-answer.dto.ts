import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { Optional } from "@nestjs/common";

export class UpdateAnswerDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @Expose()
  @Optional()
  isApproved: boolean;
}
