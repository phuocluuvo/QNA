import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard } from "../auth/guards/accessToken.guard";
import { Body } from "@nestjs/common/decorators/http/route-params.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "../enums/role.enum";
import { PublicGuard } from "../auth/guards/public.guard";
import { AnnouncementService } from "./announcement.service";
import { Roles } from "src/auth/decorator/roles.decorator";
import { UpdateAnnouncementDto } from "./dto/update-announcement.dto";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { PaginateQuery } from "nestjs-paginate";

@Controller("announcement")
@ApiTags("announcement")
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @ApiOperation({
    summary: "create announcement",
  })
  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createAnnouncement(
    @Req() req: Request,
    @Body() createAnnouncementDto: CreateAnnouncementDto,
  ) {
    return this.announcementService.create(createAnnouncementDto);
  }

  @ApiOperation({
    summary: "update announcement",
  })
  @Patch(":id")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateAnnouncement(
    @Req() req: Request,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
    @Param("id") id: string,
  ) {
    return this.announcementService.update(id, updateAnnouncementDto);
  }

  @ApiOperation({
    summary: "get all announcement",
  })
  @Get()
  @UseGuards(PublicGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllAnnouncement(@Query() query: PaginateQuery) {
    return this.announcementService.getAll(query);
  }

  @ApiOperation({
    summary: "get all announcement for user",
  })
  @Get("/user")
  @UseGuards(PublicGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER, Role.MONITOR)
  async getAllAnnouncementForUser(@Query() query: PaginateQuery) {
    return this.announcementService.getAllForUser(query);
  }

  @ApiOperation({
    summary: "get detail announcement",
  })
  @Get(":id")
  @UseGuards(PublicGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER, Role.MONITOR)
  async getDetailAnnouncement(@Param("id") id: string) {
    return this.announcementService.getOne(id);
  }

  @ApiOperation({
    summary: "delete announcement",
  })
  @Delete(":id")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteAnnouncement(@Req() req: Request, @Param("id") id: string) {
    return this.announcementService.delete(id);
  }
}
