import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class UpdateAnnouncementDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsDateString()
  @Expose()
  @IsOptional()
  expiration_date: Date;

  @ApiProperty()
  @IsDateString()
  @Expose()
  @IsOptional()
  publication_date: Date;

  @ApiProperty()
  @IsBoolean()
  @Expose()
  is_published: boolean;
}
