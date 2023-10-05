import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { AccessTokenGuard } from "../auth/guards/accessToken.guard";
import { UpdateUserDto } from "./dto/update-user.dto";
import { plainToClass } from "class-transformer";
import { UserDto } from "./dto/user.dto";

@ApiTags("user")
@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get the profile of the authenticated user.
   *
   * @param req The request object.
   * @returns Promise<UserDto> The profile of the authenticated user.
   */
  @ApiOperation({
    summary: "get profile user",
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get("profile")
  async getProfile(@Request() req) {
    const user = await this.usersService.getProfile(req.user["sub"]);
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  /**
   * Update the profile of a user.
   *
   * @param req get id login user
   * @param updateUserDto Data for updating the user profile.
   * @returns Promise<User> The updated user profile.
   */
  @ApiOperation({
    summary: "update profile user",
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch()
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const id = req.user["sub"];
    const user = await this.usersService.updateProfile(id, updateUserDto);
    return plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
