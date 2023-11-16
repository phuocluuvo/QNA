import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { AccessTokenGuard } from "../auth/guards/accessToken.guard";
import { UpdateUserDto } from "./dto/update-user.dto";
import { plainToClass } from "class-transformer";
import { UserDto } from "./dto/user.dto";
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  PaginateQuery,
} from "nestjs-paginate";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { Role } from "../enums/role.enum";
import { userPaginateConfig } from "../config/pagination/user-pagination";
import { User } from "./entity/users.entity";
import { UpdateUserAdminDto } from "./dto/update-user-admin.dto";
import { CreateUserAdminDto } from "./dto/create-user-admin.dto";

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

  /**
   * Get all user.
   * @param query - Pagination query.
   */
  @ApiOperation({
    summary: "get all user for admin",
  })
  @ApiOkPaginatedResponse(User, userPaginateConfig)
  @ApiPaginationQuery(userPaginateConfig)
  @ApiBearerAuth()
  @Get()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllUser(@Query() query: PaginateQuery) {
    return this.usersService.getAllUser(query);
  }

  /**
   * Update the profile of a user.
   *
   * @param id ID of the user to update.
   * @param createUserDto
   * @returns Promise<User> The updated user profile.
   */
  @ApiOperation({
    summary: "create user for admin",
  })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createUserForAdmin(
    @Param("id") id: string,
    @Body() createUserDto: CreateUserAdminDto,
  ) {
    const user = await this.usersService.createUserForAdmin(createUserDto);
    return plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Update the profile of a user.
   *
   * @param id ID of the user to update.
   * @param updateUserDto Data for updating the user profile.
   * @returns Promise<User> The updated user profile.
   */
  @ApiOperation({
    summary: "update user for admin",
  })
  @ApiBearerAuth()
  @Patch(":id")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateUserForAdmin(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserAdminDto,
  ) {
    const user = await this.usersService.updateUserForAdmin(id, updateUserDto);
    return plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
