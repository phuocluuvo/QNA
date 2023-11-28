"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const question_service_1 = require("../question/question.service");
const tag_service_1 = require("../tag/tag.service");
const users_service_1 = require("../users/users.service");
let DashboardService = class DashboardService {
    constructor(questionService, usersService, tagService) {
        this.questionService = questionService;
        this.usersService = usersService;
        this.tagService = tagService;
    }
    getCountQuestion() {
        return this.questionService.getCountQuestion();
    }
    async getDataDashboard() {
        return {
            data: {
                top5_question_has_most_answers: await this.questionService.getTop5ByAnswers(),
                top5_question_has_most_views: await this.questionService.getTop5ByViews(),
                top5_question_has_most_votes: await this.questionService.getTop5ByVotes(),
                top5_user_has_most_answers: await this.usersService.getTop5HasMostAnswer(),
                top5_user_has_most_questions: await this.usersService.getTop5HasMostQuestion(),
                top5_tag_has_most_questions: await this.tagService.getTop5HasMostQuestion(),
            },
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [question_service_1.QuestionService,
        users_service_1.UsersService,
        tag_service_1.TagService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map