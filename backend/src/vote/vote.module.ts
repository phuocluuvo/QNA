import { Module } from "@nestjs/common";
import { VoteService } from "./vote.service";
import { DatabaseModule } from "../database/database.module";
import { voteProviders } from "./providers/vote.providers";

@Module({
  imports: [DatabaseModule],
  providers: [...voteProviders, VoteService],
  exports: [VoteService],
})
export class VoteModule {}
