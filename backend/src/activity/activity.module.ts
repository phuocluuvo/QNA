import { Module } from "@nestjs/common";
import { ActivityController } from "./activity.controller";
import { ActivityService } from "./activity.service";
import { DatabaseModule } from "../database/database.module";
import { activityProviders } from "./providers/activity.providers";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [ActivityController],
  providers: [...activityProviders, ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
