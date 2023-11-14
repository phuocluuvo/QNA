import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { DatabaseModule } from "../database/database.module";
import { notificationProviders } from "./providers/notification.providers";

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationController],
  providers: [...notificationProviders, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
