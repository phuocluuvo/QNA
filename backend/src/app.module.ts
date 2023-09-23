import { UserModule } from "./user/user.module";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AnswerModule } from "./answer/answer.module";
import { QuestionModule } from "./question/question.module";

@Module({
  imports: [UserModule, AnswerModule, QuestionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
