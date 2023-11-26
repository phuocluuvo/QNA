import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { SysconfigService } from "./sysconfig.service";
import { UpdateSysconfigDto } from "./dto/update-sysconfig.dto";
import { CreateSysconfigDto } from "./dto/create-sysconfig.dto";
import { AccessTokenGuard } from "../auth/guards/accessToken.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { Role } from "../enums/role.enum";

@Controller("sysconfig")
export class SysconfigController {
  constructor(private readonly sysconfigService: SysconfigService) {}

  @Get()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAll() {
    return await this.sysconfigService.findAll();
  }

  @Get(":id")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findOne(@Param("id") id: string) {
    return await this.sysconfigService.findOne(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() sysconfigDto: CreateSysconfigDto, @Req() req: Request) {
    return await this.sysconfigService.create(sysconfigDto, req["user"]["sub"]);
  }

  @Patch(":id")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param("id") id: string,
    @Body() sysconfigDto: UpdateSysconfigDto,
    userId: string,
  ) {
    return await this.sysconfigService.update(id, sysconfigDto, userId);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async delete(@Param("id") id: string) {
    return await this.sysconfigService.delete(id);
  }
}
