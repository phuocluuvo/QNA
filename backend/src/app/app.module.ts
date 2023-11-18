import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AnswerModule } from "../answer/answer.module";
import { QuestionModule } from "../question/question.module";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { CaslModule } from "../casl/casl.module";
import { RedisCacheModule } from "../redis/cache.module";
import { VoteModule } from "../vote/vote.module";
import { CommentModule } from "../comment/comment.module";
import { TagModule } from "../tag/tag.module";
import { ActivityModule } from "../activity/activity.module";
import { NotificationModule } from "../notification/notification.module";
import { BookmarkModule } from "../bookmark/bookmark.module";
import { CollectionModule } from "../collection/collection.module";
import { DashboardModule } from "src/dashboard/dashboard.module";
import { HistoryModule } from "../history/history.module";

@Module({
  imports: [
    UsersModule,
    AnswerModule,
    QuestionModule,
    AuthModule,
    CaslModule,
    RedisCacheModule,
    VoteModule,
    CommentModule,
    TagModule,
    ActivityModule,
    NotificationModule,
    BookmarkModule,
    CollectionModule,
    DashboardModule,
    HistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
