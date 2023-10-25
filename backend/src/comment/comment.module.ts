import { Module } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { DatabaseModule } from "../database/database.module";
import { commentProviders } from "./providers/comment.providers";
import { CaslModule } from "../casl/casl.module";
import { AnswerModule } from "../answer/answer.module";

@Module({
  imports: [DatabaseModule, CaslModule, AnswerModule],
  controllers: [CommentController],
  providers: [...commentProviders, CommentService],
})
export class CommentModule {}
