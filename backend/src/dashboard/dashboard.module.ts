import { Module } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";
import { TagModule } from "src/tag/tag.module";
import { UsersModule } from "src/users/users.module";
import { QuestionModule } from "src/question/question.module";

@Module({
  imports: [TagModule, UsersModule, QuestionModule],
  providers: [DashboardService],
  controllers: [DashboardController],
  exports: [DashboardService],
})
export class DashboardModule {}
