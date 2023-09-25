import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { AccessTokenGuard } from "../auth/guards/accessToken.guard";
import { UpdateUserDto } from "./dto/update-user.dto";

@ApiTags("user")
@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({
    summary: "get profile user",
  })
  @UseGuards(AccessTokenGuard)
  @Get("profile")
  getProfile(@Request() req) {
    //Todo filter
    return this.usersService.findById(req.user["sub"]);
  }

  @ApiOperation({
    summary: "update profile user",
  })
  @UseGuards(AccessTokenGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
