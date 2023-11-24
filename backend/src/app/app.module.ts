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
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "src/auth/google.strategy";
import { AnnouncementModule } from "src/announcement/announcement.module";
import { GithubStrategy } from "src/auth/github.strategy";

@Module({
  imports: [
    UsersModule,
    AnswerModule,
    QuestionModule,
    AuthModule,
    CaslModule,
    VoteModule,
    CommentModule,
    TagModule,
    ActivityModule,
    NotificationModule,
    BookmarkModule,
    CollectionModule,
    DashboardModule,
    HistoryModule,
    PassportModule.register({ defaultStrategy: "google" }),
    PassportModule.register({ defaultStrategy: "github" }),
    RedisCacheModule,
    AnnouncementModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy, GithubStrategy],
})
export class AppModule {}
