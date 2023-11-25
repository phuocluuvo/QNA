import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { DatabaseModule } from "../database/database.module";
import { usersProviders } from "./providers/users.providers";
import { EmailModule } from "src/email/email.module";

@Module({
  imports: [DatabaseModule, EmailModule],
  controllers: [UsersController],
  providers: [...usersProviders, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
