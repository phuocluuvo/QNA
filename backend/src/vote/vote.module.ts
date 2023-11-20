import { Module } from "@nestjs/common";
import { VoteService } from "./vote.service";
import { DatabaseModule } from "../database/database.module";
import { voteProviders } from "./providers/vote.providers";
import { ActivityModule } from "../activity/activity.module";
import { NotificationModule } from "../notification/notification.module";
import { VoteController } from './vote.controller';

@Module({
  imports: [DatabaseModule, ActivityModule, NotificationModule],
  providers: [...voteProviders, VoteService],
  exports: [VoteService],
  controllers: [VoteController],
})
export class VoteModule {}
