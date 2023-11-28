"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerModule = void 0;
const common_1 = require("@nestjs/common");
const answer_controller_1 = require("./answer.controller");
const answer_service_1 = require("./answer.service");
const database_module_1 = require("../database/database.module");
const answer_providers_1 = require("./providers/answer.providers");
const question_module_1 = require("../question/question.module");
const casl_module_1 = require("../casl/casl.module");
const vote_module_1 = require("../vote/vote.module");
const activity_module_1 = require("../activity/activity.module");
const notification_module_1 = require("../notification/notification.module");
const history_module_1 = require("../history/history.module");
let AnswerModule = class AnswerModule {
};
exports.AnswerModule = AnswerModule;
exports.AnswerModule = AnswerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            question_module_1.QuestionModule,
            vote_module_1.VoteModule,
            casl_module_1.CaslModule,
            activity_module_1.ActivityModule,
            notification_module_1.NotificationModule,
            history_module_1.HistoryModule,
        ],
        controllers: [answer_controller_1.AnswerController],
        providers: [...answer_providers_1.answerProviders, answer_service_1.AnswerService],
        exports: [answer_service_1.AnswerService],
    })
], AnswerModule);
//# sourceMappingURL=answer.module.js.map