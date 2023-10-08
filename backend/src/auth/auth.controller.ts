import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
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

  /**
   * Register a new user.
   *
   * @param createUserDto Data for creating a new user.
   * @returns Promise<any> Tokens for the registered user.
   */
  @ApiOperation({
    summary: "Login as a user",
  })
  @Post("signup")
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  /**
   * Login as a user.
   *
   * @param data Data for user login.
   * @returns Promise<any> Tokens for the logged-in user.
   */
  @ApiOperation({
    summary: "Register as a user",
  })
  @Post("signin")
  async signin(@Body() data: LoginUserDto) {
    return this.authService.signIn(data);
  }

  /**
   * Logout a user.
   *
   * @param req The request object to access the authenticated user's ID.
   */

  @ApiOperation({
    summary: "Logout as a user",
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get("logout")
  async logout(@Req() req: Request) {
    const userId = req.user["sub"];
    this.authService.logout(userId);
  }

  /**
   * Refresh access tokens for a user.
   *
   * @param req The request object to access the authenticated user's ID and refresh token.
   * @returns Promise< accessToken: string; refreshToken: string > The refreshed tokens.
   */
  @ApiOperation({
    summary: "Refresh token",
  })
  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Post("refresh")
  refreshTokens(@Req() req: Request) {
    const userId = req.user["sub"];
    const refreshToken = req.user["refreshToken"];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
