import { Module } from "@nestjs/common";
import { AnnouncementService } from "./announcement.service";
import { AnnouncementController } from "./announcement.controller";
import { announcementProviders } from "./announcement.providers";
import { DatabaseModule } from "src/database/database.module";

@Module({
  providers: [AnnouncementService, ...announcementProviders],
  exports: [AnnouncementService],
  controllers: [AnnouncementController],
  imports: [DatabaseModule],
})
export class AnnouncementModule {}
