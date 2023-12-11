import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { Request } from "express";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { LoginUserDto } from "../users/dto/login-user.dto";
import { AccessTokenGuard } from "./guards/accessToken.guard";
import { RefreshTokenGuard } from "./guards/refreshToken.guard";
import { AuthGuard } from "@nestjs/passport";

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

  /**
   * Refresh access tokens for a user.
   *
   * @param req The request object to access the authenticated user's ID and refresh token.
   * @returns Promise< accessToken: string; refreshToken: string > The refreshed tokens.
   */
  @ApiOperation({
    summary: "Refresh token v2",
  })
  @Post("refresh-v2")
  refreshTokensV2(@Body() data: any) {
    return this.authService.refreshTokensV2(data.refreshToken);
  }

  @Get("/google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {}

  @Get("/google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req, @Res() res) {
    try {
      const info = await this.authService.signInWithGoogle(req.user);
      if (info.refreshToken) {
        res.redirect(
          `${process.env.URL_WEB}/auth/signin/?refreshToken=${info.refreshToken}`,
        );
      } else {
        res.redirect(`${process.env.URL_WEB}/auth/signin/?error=singin failed`);
      }
    } catch (err) {
      res.redirect(`${process.env.URL_WEB}/auth/signin/?error=${err.message}`);
    }
  }

  @Get("/github")
  @UseGuards(AuthGuard("github"))
  async githubAuth() {}

  @Get("/github/callback")
  @UseGuards(AuthGuard("github"))
  async githubAuthRedirect(@Req() req, @Res() res) {
    try {
      const info = await this.authService.signInWithGithub(req.user);
      if (info.refreshToken) {
        res.redirect(
          `${process.env.URL_WEB}/auth/signin/?refreshToken=${info.refreshToken}`,
        );
      } else {
        res.redirect(`${process.env.URL_WEB}/auth/signin/?error=singin failed`);
      }
    } catch (err) {
      res.redirect(`${process.env.URL_WEB}/auth/signin/?error=${err.message}`);
    }
  }

  @Post("/forgot-password")
  async forgotPassword(@Query("username") username: string) {
    return this.authService.forgotPassword(username);
  }

  @Post("/reset-password")
  async resetPassword(
    @Body("uuid") uuid: string,
    @Body("password") password: string,
  ) {
    return this.authService.resetPassword(uuid, password);
  }

  @Get("/exists")
  async checkUserExists(@Query("username") username: string) {
    return this.authService.checkUserExists(username);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get("/confirm-password")
  async confirmPassword(
    @Req() req: Request,
    @Query("password") password: string,
  ) {
    const userId = req.user["sub"];
    return this.authService.confirmPassword(userId, password);
  }

  @Get("/send-email-verify/:userId")
  async sendEmailVerify(@Param("userId") userId: string) {
    return this.authService.sendEmailVefiry(userId);
  }

  @Post("/confirm-email/:userId")
  async confirmEmail(
    @Body("otp") otp: string,
    @Param("userId") userId: string,
  ) {
    return this.authService.confirmEmail(userId, otp);
  }
}
