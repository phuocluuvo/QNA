import { Module } from "@nestjs/common";
import { QuestionController } from "./question.controller";
import { QuestionService } from "./question.service";
import { questionProviders } from "./providers/question.providers";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [QuestionController],
  providers: [...questionProviders, QuestionService],
})
export class QuestionModule {}
