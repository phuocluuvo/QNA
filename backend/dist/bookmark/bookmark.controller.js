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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bookmark_service_1 = require("./bookmark.service");
const nestjs_paginate_1 = require("nestjs-paginate");
const create_bookmark_dto_1 = require("./dto/create-bookmark.dto");
const question_service_1 = require("../question/question.service");
const answer_service_1 = require("../answer/answer.service");
const accessToken_guard_1 = require("../auth/guards/accessToken.guard");
const action_enum_1 = require("../enums/action.enum");
const message_constants_1 = require("../constants/message.constants");
const casl_ability_factory_1 = require("../casl/casl-ability.factory");
const collection_service_1 = require("../collection/collection.service");
let BookmarkController = class BookmarkController {
    constructor(bookmarkService, questionService, answerService, collectionService, caslAbilityFactory) {
        this.bookmarkService = bookmarkService;
        this.questionService = questionService;
        this.answerService = answerService;
        this.collectionService = collectionService;
        this.caslAbilityFactory = caslAbilityFactory;
    }
    async find(query, req) {
        const userId = req["user"]["sub"];
        return this.bookmarkService.find(query, userId);
    }
    async getBookmarkCollectionForLater(query, req) {
        const userId = req["user"]["sub"];
        return this.bookmarkService.getBookmarkCollectionForLater(query, userId);
    }
    async getBookmarkCollection(query, req, collectionId) {
        const userId = req["user"]["sub"];
        return this.bookmarkService.getBookmarkCollection(query, userId, collectionId);
    }
    async create(createBookmarkDto, req) {
        if ((createBookmarkDto.answer_id && createBookmarkDto.question_id) ||
            (!createBookmarkDto.answer_id && !createBookmarkDto.question_id)) {
            throw new common_1.BadRequestException("Either answer_id or question_id should be provided, not both or none.");
        }
        else if (!createBookmarkDto.answer_id && createBookmarkDto.question_id) {
            await this.questionService.findOneById(createBookmarkDto.question_id);
            const checkQuestionBookmark = await this.bookmarkService.checkQuestionIsBookmark(createBookmarkDto.question_id, req["user"]["sub"]);
            if (checkQuestionBookmark)
                throw new common_1.BadRequestException(message_constants_1.message.EXISTED.BOOKMARK);
        }
        else if (createBookmarkDto.answer_id && !createBookmarkDto.question_id) {
            await this.answerService.findOneById(createBookmarkDto.answer_id);
            const checkAnswerBookmark = await this.bookmarkService.checkAnswerIsBookmark(createBookmarkDto.answer_id, req["user"]["sub"]);
            if (checkAnswerBookmark)
                throw new common_1.BadRequestException(message_constants_1.message.EXISTED.BOOKMARK);
        }
        return this.bookmarkService.create(createBookmarkDto, req["user"]["sub"]);
    }
    async update(collectionId, req, id) {
        const ability = this.caslAbilityFactory.createForUser(req["user"]);
        const bookmark = await this.bookmarkService.findOneById(id);
        let collection = null;
        if (collectionId != null) {
            collection = await this.collectionService.findOneById(collectionId);
        }
        if (ability.can(action_enum_1.Action.Update, bookmark)) {
            return this.bookmarkService.update(bookmark, collection);
        }
        else {
            throw new common_1.ForbiddenException(message_constants_1.message.NOT_AUTHOR.BOOKMARK);
        }
    }
    async delete(id, req) {
        const bookmark = await this.bookmarkService.findOneById(id);
        const ability = this.caslAbilityFactory.createForUser(req["user"]);
        if (ability.can(action_enum_1.Action.Delete, bookmark)) {
            return this.bookmarkService.remove(bookmark);
        }
        else {
            throw new common_1.ForbiddenException(message_constants_1.message.NOT_AUTHOR.BOOKMARK);
        }
    }
};
exports.BookmarkController = BookmarkController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get all bookmark",
    }),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, nestjs_paginate_1.Paginate)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Request]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "find", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get all bookmark by collection for later",
    }),
    (0, common_1.Get)("collection/later"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, nestjs_paginate_1.Paginate)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Request]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "getBookmarkCollectionForLater", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get all bookmark by collection id",
    }),
    (0, common_1.Get)("collection/:id"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, nestjs_paginate_1.Paginate)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Request, String]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "getBookmarkCollection", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "create bookmark",
    }),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bookmark_dto_1.CreateBookmarkDto,
        Request]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "update collection of bookmark",
    }),
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Body)("collection_id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Request, String]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "delete bookmark",
    }),
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Request]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "delete", null);
exports.BookmarkController = BookmarkController = __decorate([
    (0, common_1.Controller)("bookmark"),
    (0, swagger_1.ApiTags)("bookmark"),
    __metadata("design:paramtypes", [bookmark_service_1.BookmarkService,
        question_service_1.QuestionService,
        answer_service_1.AnswerService,
        collection_service_1.CollectionService,
        casl_ability_factory_1.CaslAbilityFactory])
], BookmarkController);
//# sourceMappingURL=bookmark.controller.js.map