import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateAnswerDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  content: string;
}
