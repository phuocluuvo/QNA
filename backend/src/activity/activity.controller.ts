import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { ActivityService } from "./activity.service";
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from "nestjs-paginate";
import { activityPaginateConfig } from "../config/pagination/activity-pagination";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard } from "../auth/guards/accessToken.guard";
import { Activity } from "./entity/activity.entity";

@Controller("activity")
@ApiTags("activity")
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  /**
   * get activity history user
   * @param query
   * @param req
   */
  @ApiOkPaginatedResponse(Activity, activityPaginateConfig)
  @ApiPaginationQuery(activityPaginateConfig)
  @ApiOperation({
    summary: "get activity history user",
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get("history")
  async getActivityHistory(@Paginate() query: PaginateQuery, @Request() req) {
    const userId = req.user["sub"];
    return this.activityService.findByUserId(query, userId);
  }
}
