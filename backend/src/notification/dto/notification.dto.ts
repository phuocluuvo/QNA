import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class NotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  description: string;
}
