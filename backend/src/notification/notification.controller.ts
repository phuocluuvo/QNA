import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { NotificationService } from "./notification.service";
import { AccessTokenGuard } from "../auth/guards/accessToken.guard";

@Controller("notification")
@ApiTags("notification")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async getNotifications(@Req() req: Request) {
    return this.notificationService.findByUserId(req["user"]["sub"]);
  }
}
