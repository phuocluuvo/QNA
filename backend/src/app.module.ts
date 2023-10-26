import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AnswerModule } from "./answer/answer.module";
import { QuestionModule } from "./question/question.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { CaslModule } from "./casl/casl.module";
import { RedisCacheModule } from "./redis/cache.module";
import { VoteModule } from "./vote/vote.module";
import { CommentModule } from "./comment/comment.module";
import { TagModule } from "./tag/tag.module";

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
