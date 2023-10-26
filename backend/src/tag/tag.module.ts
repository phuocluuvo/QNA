import { Module } from "@nestjs/common";
import { TagController } from "./tag.controller";
import { TagService } from "./tag.service";
import { DatabaseModule } from "../database/database.module";
import { tagProviders } from "./providers/tag.providers";

@Module({
  imports: [DatabaseModule],
  controllers: [TagController],
  providers: [...tagProviders, TagService],
  exports: [TagService],
})
export class TagModule {}
