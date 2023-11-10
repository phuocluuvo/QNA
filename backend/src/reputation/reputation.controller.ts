import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { ReputationService } from "./reputation.service";
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from "nestjs-paginate";
import { Reputation } from "./entity/reputation.entity";
import { reputationPaginateConfig } from "../config/pagination/activity-pagination";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard } from "../auth/guards/accessToken.guard";

@Controller("activity")
@ApiTags("Reputation")
export class ReputationController {
  constructor(private readonly reputationService: ReputationService) {}

  /**
   * get activity history user
   * @param query
   * @param req
   */
  @ApiOkPaginatedResponse(Reputation, reputationPaginateConfig)
  @ApiPaginationQuery(reputationPaginateConfig)
  @ApiOperation({
    summary: "get activity history user",
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get("history")
  async getActivityHistory(@Paginate() query: PaginateQuery, @Request() req) {
    const userId = req.user["sub"];
    return this.reputationService.findByUserId(query, userId);
  }
}
