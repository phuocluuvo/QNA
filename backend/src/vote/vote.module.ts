import { Module } from "@nestjs/common";
import { VoteService } from "./vote.service";
import { DatabaseModule } from "../database/database.module";
import { voteProviders } from "./providers/vote.providers";
import { ActivityModule } from "../activity/activity.module";

@Module({
  imports: [DatabaseModule, ActivityModule],
  providers: [...voteProviders, VoteService],
  exports: [VoteService],
})
export class VoteModule {}
