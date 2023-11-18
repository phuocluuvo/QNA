import { Injectable } from "@nestjs/common";
import { QuestionService } from "src/question/question.service";
import { TagService } from "src/tag/tag.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class DashboardService {
  constructor(
    private readonly questionService: QuestionService,
    private readonly usersService: UsersService,
    private readonly tagService: TagService,
  ) {}

  getCountQuestion() {
    return this.questionService.getCountQuestion();
  }

  async getDataDashboard() {
    return {
      data: {
        top5_question_has_most_answers:
          await this.questionService.getTop5ByAnswers(),
        top5_question_has_most_views:
          await this.questionService.getTop5ByViews(),
        top5_question_has_most_votes:
          await this.questionService.getTop5ByVotes(),
        top5_user_has_most_answers:
          await this.usersService.getTop5HasMostAnswer(),
        top5_user_has_most_questions:
          await this.usersService.getTop5HasMostQuestion(),
        top5_tag_has_most_questions:
          await this.tagService.getTop5HasMostQuestion(),
      },
    };
  }
}
