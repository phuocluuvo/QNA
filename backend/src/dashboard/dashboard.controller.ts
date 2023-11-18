import { Controller, Get, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Role } from "src/enums/role.enum";
import { AccessTokenGuard } from "src/auth/guards/accessToken.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * count question for dashboard
   * @returns count question for dashboard
   */
  @ApiOperation({
    summary: "count question for dashboard",
  })
  @ApiBearerAuth()
  @Get("/count-question")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MONITOR)
  async getCountQuestion() {
    return this.dashboardService.getCountQuestion();
  }

  /**
   * count question for dashboard
   * @returns count question for dashboard
   */
  @ApiOperation({
    summary: "data for dashboard",
  })
  @ApiBearerAuth()
  @Get("/data")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MONITOR)
  async getData() {
    return this.dashboardService.getDataDashboard();
  }
}
