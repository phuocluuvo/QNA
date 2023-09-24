import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AnswerModule } from "./answer/answer.module";
import { QuestionModule } from "./question/question.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [UsersModule, AnswerModule, QuestionModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
