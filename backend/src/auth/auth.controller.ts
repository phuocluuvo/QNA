import { Controller, Post, UseGuards, Req } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: "Login as a user",
  })
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async login(@Req() req: Request) {
    console.log(req);
    return await this.authService.login(req["user"]);
  }
}
