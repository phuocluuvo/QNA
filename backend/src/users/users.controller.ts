import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

@ApiTags("user")
@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: "sign up user",
  })
  @Post("/signup")
  @ApiOperation({
    summary: "Sign Up as a user",
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({
    summary: "get profile user",
  })
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }
}
