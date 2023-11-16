import { Module } from "@nestjs/common";
import { TagController } from "./tag.controller";
import { TagService } from "./tag.service";
import { DatabaseModule } from "../database/database.module";
import { tagProviders } from "./providers/tag.providers";
import { ActivityModule } from "../activity/activity.module";

@Module({
  imports: [DatabaseModule, ActivityModule],
  controllers: [TagController],
  providers: [...tagProviders, TagService],
  exports: [TagService],
})
export class TagModule {}
