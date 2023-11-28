"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModule = void 0;
const common_1 = require("@nestjs/common");
const comment_controller_1 = require("./comment.controller");
const comment_service_1 = require("./comment.service");
const database_module_1 = require("../database/database.module");
const comment_providers_1 = require("./providers/comment.providers");
const casl_module_1 = require("../casl/casl.module");
const answer_module_1 = require("../answer/answer.module");
const activity_module_1 = require("../activity/activity.module");
const notification_module_1 = require("../notification/notification.module");
const question_module_1 = require("../question/question.module");
const history_module_1 = require("../history/history.module");
let CommentModule = class CommentModule {
};
exports.CommentModule = CommentModule;
exports.CommentModule = CommentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            casl_module_1.CaslModule,
            answer_module_1.AnswerModule,
            activity_module_1.ActivityModule,
            notification_module_1.NotificationModule,
            question_module_1.QuestionModule,
            history_module_1.HistoryModule,
        ],
        controllers: [comment_controller_1.CommentController],
        providers: [...comment_providers_1.commentProviders, comment_service_1.CommentService],
    })
], CommentModule);
//# sourceMappingURL=comment.module.js.map