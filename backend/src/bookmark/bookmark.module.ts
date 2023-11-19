import { forwardRef, Module } from "@nestjs/common";
import { BookmarkController } from "./bookmark.controller";
import { BookmarkService } from "./bookmark.service";
import { DatabaseModule } from "../database/database.module";
import { bookmarkProviders } from "./providers/bookmark.providers";
import { QuestionModule } from "../question/question.module";
import { AnswerModule } from "../answer/answer.module";
import { CaslModule } from "../casl/casl.module";
import { CollectionModule } from "../collection/collection.module";

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => QuestionModule),
    forwardRef(() => AnswerModule),
    CaslModule,
    CollectionModule,
  ],
  controllers: [BookmarkController],
  providers: [...bookmarkProviders, BookmarkService],
  exports: [BookmarkService],
})
export class BookmarkModule {}
