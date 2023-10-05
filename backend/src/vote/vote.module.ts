import { Module } from "@nestjs/common";
import { VoteService } from "./vote.service";

@Module({
  providers: [VoteService],
})
export class VoteModule {}
