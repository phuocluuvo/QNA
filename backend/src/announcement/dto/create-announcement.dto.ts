import { IsBoolean, IsDateString, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CreateAnnouncementDto {
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

  @ApiProperty()
  @IsDateString()
  @Expose()
  expiration_date: Date;

  @ApiProperty()
  @IsDateString()
  @Expose()
  publication_date: Date;

  @ApiProperty()
  @IsBoolean()
  @Expose()
  is_published: boolean;
}
