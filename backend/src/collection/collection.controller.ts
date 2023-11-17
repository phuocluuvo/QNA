import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CollectionService } from "./collection.service";
import { AccessTokenGuard } from "../auth/guards/accessToken.guard";
import { CaslAbilityFactory } from "../casl/casl-ability.factory";
import { Action } from "../enums/action.enum";
import { message } from "../constants/message.constants";

@Controller("collection")
@ApiTags("collection")
export class CollectionController {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @ApiOperation({
    summary: "get all collection",
  })
  @ApiBearerAuth()
  @Get()
  @UseGuards(AccessTokenGuard)
  async findAllCollection(@Req() req: Request) {
    const userId = req["user"]["sub"];
    return this.collectionService.findAllCollection(userId);
  }

  @ApiOperation({
    summary: "create collection",
  })
  @Post()
  @UseGuards(AccessTokenGuard)
  async createCollection(@Body("name") name: string, @Req() req: Request) {
    const userId = req["user"]["sub"];
    return this.collectionService.createCollection(name, userId);
  }

  @ApiOperation({
    summary: "update name collection",
  })
  @Patch(":id")
  @UseGuards(AccessTokenGuard)
  async updateCollection(
    @Param("id") id: string,
    @Body("name") name: string,
    @Req() req: Request,
  ) {
    const collection = await this.collectionService.findOneById(id);
    const ability = this.caslAbilityFactory.createForUser(req["user"]);

    if (ability.can(Action.Update, collection)) {
      return this.collectionService.update(id, name, collection);
    } else {
      throw new ForbiddenException(message.NOT_AUTHOR.COLLECTION);
    }
  }

  @ApiOperation({
    summary: "delete collection",
  })
  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  async deleteCollection(@Param("id") id: string, @Req() req: Request) {
    const collection = await this.collectionService.findOneById(id);
    const ability = this.caslAbilityFactory.createForUser(req["user"]);

    if (ability.can(Action.Delete, collection)) {
      return this.collectionService.delete(collection);
    } else {
      throw new ForbiddenException(message.NOT_AUTHOR.COLLECTION);
    }
  }
}
