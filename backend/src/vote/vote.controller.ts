import { Controller, Get, Param } from "@nestjs/common";
import { VoteService } from "./vote.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller("vote")
@ApiTags("vote")
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @ApiOperation({ summary: "vote info" })
  @Get("summary/:id")
  async getVoteInfo(@Param("id") id: string) {
    return await this.voteService.getVoteInfoByUser(id);
  }
}
