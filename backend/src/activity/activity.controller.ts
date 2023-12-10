import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
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

  /**
   * get activity history userId
   * @param query
   * @param id
   */
  @ApiOperation({
    summary: "get activity history userId",
  })
  @Get("history/:id")
  async getActivityHistoryByUser(
    @Paginate() query: PaginateQuery,
    @Param("id") id: string,
  ) {
    return this.activityService.findByUserId(query, id);
  }

  @Get("activityPointChange/:id")
  async getActivityPointChange(
    @Param("id") id: string,
    @Query("date") date: string,
  ) {
    return this.activityService.getPointChange(id, date);
  }
}
