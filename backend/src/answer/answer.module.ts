import { Module } from "@nestjs/common";
import { AnswerController } from "./answer.controller";
import { AnswerService } from "./answer.service";
import { DatabaseModule } from "../database/database.module";
import { answerProviders } from "./providers/answer.providers";

@Module({
  imports: [DatabaseModule],
  controllers: [AnswerController],
  providers: [...answerProviders, AnswerService],
})
export class AnswerModule {}
