import { QuestionService } from "src/question/question.service";
import { TagService } from "src/tag/tag.service";
import { UsersService } from "src/users/users.service";
export declare class DashboardService {
    private readonly questionService;
    private readonly usersService;
    private readonly tagService;
    constructor(questionService: QuestionService, usersService: UsersService, tagService: TagService);
    getCountQuestion(): Promise<{
        data: {
            all: number;
            currentDay: number;
            currentMonth: number;
            currentQuarter: number;
            currentYear: number;
        };
    }>;
    getDataDashboard(): Promise<{
        data: {
            top5_question_has_most_answers: import("../question/entity/question.entity").Question[];
            top5_question_has_most_views: import("../question/entity/question.entity").Question[];
            top5_question_has_most_votes: import("../question/entity/question.entity").Question[];
            top5_user_has_most_answers: any[];
            top5_user_has_most_questions: any[];
            top5_tag_has_most_questions: any[];
        };
    }>;
}
