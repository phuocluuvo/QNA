import { Module } from "@nestjs/common";
import { ReputationController } from "./reputation.controller";
import { ReputationService } from "./reputation.service";
import { DatabaseModule } from "../database/database.module";
import { reputationProviders } from "./providers/reputation.providers";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [ReputationController],
  providers: [...reputationProviders, ReputationService],
  exports: [ReputationService],
})
export class ReputationModule {}
