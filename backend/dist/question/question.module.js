"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionModule = void 0;
const common_1 = require("@nestjs/common");
const question_controller_1 = require("./question.controller");
const question_service_1 = require("./question.service");
const question_providers_1 = require("./providers/question.providers");
const database_module_1 = require("../database/database.module");
const users_module_1 = require("../users/users.module");
const casl_module_1 = require("../casl/casl.module");
const vote_module_1 = require("../vote/vote.module");
const tag_module_1 = require("../tag/tag.module");
const activity_module_1 = require("../activity/activity.module");
const notification_module_1 = require("../notification/notification.module");
const history_module_1 = require("../history/history.module");
const bookmark_module_1 = require("../bookmark/bookmark.module");
let QuestionModule = class QuestionModule {
};
exports.QuestionModule = QuestionModule;
exports.QuestionModule = QuestionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            users_module_1.UsersModule,
            vote_module_1.VoteModule,
            tag_module_1.TagModule,
            casl_module_1.CaslModule,
            activity_module_1.ActivityModule,
            notification_module_1.NotificationModule,
            history_module_1.HistoryModule,
            (0, common_1.forwardRef)(() => bookmark_module_1.BookmarkModule),
        ],
        controllers: [question_controller_1.QuestionController],
        providers: [...question_providers_1.questionProviders, question_service_1.QuestionService],
        exports: [question_service_1.QuestionService],
    })
], QuestionModule);
//# sourceMappingURL=question.module.js.map