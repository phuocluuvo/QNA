import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
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
  @UseGuards(AccessTokenGuard)
  @Get("profile")
  getProfile(@Request() req) {
    const user = this.usersService.findById(req.user["sub"]);
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  /**
   * Update the profile of a user.
   *
   * @param id ID of the user to update.
   * @param updateUserDto Data for updating the user profile.
   * @returns Promise<User> The updated user profile.
   */
  @ApiOperation({
    summary: "update profile user",
  })
  @UseGuards(AccessTokenGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
