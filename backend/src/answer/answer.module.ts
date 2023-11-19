import { Module } from "@nestjs/common";
import { AnswerController } from "./answer.controller";
import { AnswerService } from "./answer.service";
import { DatabaseModule } from "../database/database.module";
import { answerProviders } from "./providers/answer.providers";
import { QuestionModule } from "../question/question.module";
import { CaslModule } from "../casl/casl.module";
import { VoteModule } from "../vote/vote.module";
import { ActivityModule } from "../activity/activity.module";
import { NotificationModule } from "../notification/notification.module";
import { HistoryModule } from "../history/history.module";

@Module({
  imports: [
    DatabaseModule,
    QuestionModule,
    VoteModule,
    CaslModule,
    ActivityModule,
    NotificationModule,
    HistoryModule,
  ],
  controllers: [AnswerController],
  providers: [...answerProviders, AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}
