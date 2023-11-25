import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class FindAnnouncementDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsIn(["1", "0"])
  @Expose()
  @IsOptional()
  is_published: boolean;
}
