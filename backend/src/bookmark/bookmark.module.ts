import { Module } from "@nestjs/common";
import { BookmarkController } from "./bookmark.controller";
import { BookmarkService } from "./bookmark.service";
import { DatabaseModule } from "../database/database.module";
import { bookmarkProviders } from "./providers/bookmark.providers";
import { QuestionModule } from "../question/question.module";
import { AnswerModule } from "../answer/answer.module";
import { CaslModule } from "../casl/casl.module";

@Module({
  imports: [DatabaseModule, QuestionModule, AnswerModule, CaslModule],
  controllers: [BookmarkController],
  providers: [...bookmarkProviders, BookmarkService],
})
export class BookmarkModule {}
