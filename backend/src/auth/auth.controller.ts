import { Controller, Post, UseGuards, Req, Body, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { Request } from "express";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { LoginUserDto } from "../users/dto/login-user.dto";
import { AccessTokenGuard } from "./guards/accessToken.guard";
import { RefreshTokenGuard } from "./guards/refreshToken.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: "Login as a user",
  })
  @Post("signup")
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @ApiOperation({
    summary: "Register as a user",
  })
  @Post("signin")
  async signin(@Body() data: LoginUserDto) {
    return this.authService.signIn(data);
  }

  @ApiOperation({
    summary: "Logout as a user",
  })
  @UseGuards(AccessTokenGuard)
  @Get("logout")
  async logout(@Req() req: Request) {
    console.log(req.user);
    const userId = req.user["sub"];
    this.authService.logout(userId);
  }

  @ApiOperation({
    summary: "Refresh token",
  })
  @UseGuards(RefreshTokenGuard)
  @Get("refresh")
  refreshTokens(@Req() req: Request) {
    console.log(req.user);
    const userId = req.user["sub"];
    const refreshToken = req.user["refreshToken"];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
