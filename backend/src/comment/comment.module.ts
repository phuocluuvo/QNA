import { Module } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { DatabaseModule } from "../database/database.module";
import { commentProviders } from "./providers/comment.providers";
import { CaslModule } from "../casl/casl.module";
import { AnswerModule } from "../answer/answer.module";
import { ActivityModule } from "../activity/activity.module";
import { NotificationModule } from "../notification/notification.module";
import { QuestionModule } from "../question/question.module";
import { HistoryModule } from "../history/history.module";

@Module({
  imports: [
    DatabaseModule,
    CaslModule,
    AnswerModule,
    ActivityModule,
    NotificationModule,
    QuestionModule,
    HistoryModule,
  ],
  controllers: [CommentController],
  providers: [...commentProviders, CommentService],
})
export class CommentModule {}
