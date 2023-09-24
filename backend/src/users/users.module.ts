import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { DatabaseModule } from "../database/database.module";
import { usersProviders } from "./providers/users.providers";

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [...usersProviders, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
