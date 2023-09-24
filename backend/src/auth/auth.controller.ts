import { Controller, Post, UseGuards, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Request } from "express";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: "Login as a user",
  })
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async login(@Req() req: Request) {
    return await this.authService.login(req["user"]);
  }
}
