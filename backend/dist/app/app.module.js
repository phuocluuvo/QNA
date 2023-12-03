"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const answer_module_1 = require("../answer/answer.module");
const question_module_1 = require("../question/question.module");
const auth_module_1 = require("../auth/auth.module");
const users_module_1 = require("../users/users.module");
const casl_module_1 = require("../casl/casl.module");
const cache_module_1 = require("../redis/cache.module");
const vote_module_1 = require("../vote/vote.module");
const comment_module_1 = require("../comment/comment.module");
const tag_module_1 = require("../tag/tag.module");
const activity_module_1 = require("../activity/activity.module");
const notification_module_1 = require("../notification/notification.module");
const bookmark_module_1 = require("../bookmark/bookmark.module");
const collection_module_1 = require("../collection/collection.module");
const dashboard_module_1 = require("../dashboard/dashboard.module");
const history_module_1 = require("../history/history.module");
const passport_1 = require("@nestjs/passport");
const google_strategy_1 = require("../auth/google.strategy");
const announcement_module_1 = require("../announcement/announcement.module");
const github_strategy_1 = require("../auth/github.strategy");
const sysconfig_module_1 = require("../sysconfig/sysconfig.module");
const search_middleware_1 = require("../middleware/search.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(search_middleware_1.SearchMiddleware).forRoutes("*");
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            answer_module_1.AnswerModule,
            question_module_1.QuestionModule,
            auth_module_1.AuthModule,
            casl_module_1.CaslModule,
            vote_module_1.VoteModule,
            comment_module_1.CommentModule,
            tag_module_1.TagModule,
            activity_module_1.ActivityModule,
            notification_module_1.NotificationModule,
            bookmark_module_1.BookmarkModule,
            collection_module_1.CollectionModule,
            dashboard_module_1.DashboardModule,
            history_module_1.HistoryModule,
            passport_1.PassportModule.register({ defaultStrategy: "google" }),
            passport_1.PassportModule.register({ defaultStrategy: "github" }),
            cache_module_1.RedisCacheModule,
            announcement_module_1.AnnouncementModule,
            sysconfig_module_1.SysconfigModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, google_strategy_1.GoogleStrategy, github_strategy_1.GithubStrategy],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map