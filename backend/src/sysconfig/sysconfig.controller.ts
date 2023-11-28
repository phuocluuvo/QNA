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
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller("sysconfig")
@ApiTags("sysconfig")
export class SysconfigController {
  constructor(private readonly sysconfigService: SysconfigService) {}

  @ApiOperation({ summary: "Get all sysconfig" })
  @Get()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAll() {
    return await this.sysconfigService.findAll();
  }

  @ApiOperation({ summary: "Get one sysconfig" })
  @Get(":id")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findOne(@Param("id") id: string) {
    return await this.sysconfigService.findOne(id);
  }

  @ApiOperation({ summary: "Create sysconfig" })
  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() sysconfigDto: CreateSysconfigDto, @Req() req: Request) {
    return await this.sysconfigService.create(sysconfigDto, req["user"]["sub"]);
  }

  @ApiOperation({ summary: "Update sysconfig" })
  @Patch(":id")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param("id") id: string,
    @Body() sysconfigDto: UpdateSysconfigDto,
    userId: string,
  ) {
    await this.sysconfigService.findOne(id);
    return await this.sysconfigService.update(id, sysconfigDto, userId);
  }

  @ApiOperation({ summary: "Delete sysconfig" })
  @Delete(":id")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async delete(@Param("id") id: string) {
    return await this.sysconfigService.delete(id);
  }
}
