import { forwardRef, Module } from "@nestjs/common";
import { QuestionController } from "./question.controller";
import { QuestionService } from "./question.service";
import { questionProviders } from "./providers/question.providers";
import { DatabaseModule } from "../database/database.module";
import { UsersModule } from "../users/users.module";
import { CaslModule } from "../casl/casl.module";
import { VoteModule } from "../vote/vote.module";
import { TagModule } from "../tag/tag.module";
import { ActivityModule } from "../activity/activity.module";
import { NotificationModule } from "../notification/notification.module";
import { HistoryModule } from "../history/history.module";
import { BookmarkModule } from "../bookmark/bookmark.module";

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    VoteModule,
    TagModule,
    CaslModule,
    ActivityModule,
    NotificationModule,
    HistoryModule,
    forwardRef(() => BookmarkModule),
  ],
  controllers: [QuestionController],
  providers: [...questionProviders, QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
