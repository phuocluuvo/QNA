"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkModule = void 0;
const common_1 = require("@nestjs/common");
const bookmark_controller_1 = require("./bookmark.controller");
const bookmark_service_1 = require("./bookmark.service");
const database_module_1 = require("../database/database.module");
const bookmark_providers_1 = require("./providers/bookmark.providers");
const question_module_1 = require("../question/question.module");
const answer_module_1 = require("../answer/answer.module");
const casl_module_1 = require("../casl/casl.module");
const collection_module_1 = require("../collection/collection.module");
let BookmarkModule = class BookmarkModule {
};
exports.BookmarkModule = BookmarkModule;
exports.BookmarkModule = BookmarkModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            (0, common_1.forwardRef)(() => question_module_1.QuestionModule),
            (0, common_1.forwardRef)(() => answer_module_1.AnswerModule),
            casl_module_1.CaslModule,
            collection_module_1.CollectionModule,
        ],
        controllers: [bookmark_controller_1.BookmarkController],
        providers: [...bookmark_providers_1.bookmarkProviders, bookmark_service_1.BookmarkService],
        exports: [bookmark_service_1.BookmarkService],
    })
], BookmarkModule);
//# sourceMappingURL=bookmark.module.js.map