import { DashboardService } from "./dashboard.service";
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getCountQuestion(): Promise<{
        data: {
            all: number;
            currentDay: number;
            currentMonth: number;
            currentQuarter: number;
            currentYear: number;
        };
    }>;
    getData(): Promise<{
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
