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
exports.CommentController = void 0;
const common_1 = require("@nestjs/common");
const answer_service_1 = require("../answer/answer.service");
const casl_ability_factory_1 = require("../casl/casl-ability.factory");
const comment_service_1 = require("./comment.service");
const swagger_1 = require("@nestjs/swagger");
const accessToken_guard_1 = require("../auth/guards/accessToken.guard");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const action_enum_1 = require("../enums/action.enum");
const update_comment_dto_1 = require("./dto/update-comment.dto");
const message_constants_1 = require("../constants/message.constants");
const nestjs_paginate_1 = require("nestjs-paginate");
const question_entity_1 = require("../question/entity/question.entity");
const comment_pagination_1 = require("../config/pagination/comment-pagination");
const question_service_1 = require("../question/question.service");
let CommentController = class CommentController {
    constructor(commentService, caslAbilityFactory, answerService, questionService) {
        this.commentService = commentService;
        this.caslAbilityFactory = caslAbilityFactory;
        this.answerService = answerService;
        this.questionService = questionService;
    }
    find(answerId, query) {
        return this.commentService.find(answerId, query);
    }
    async findOneById(id) {
        return this.commentService.findOneById(id);
    }
    async findHistory(id, query) {
        return this.commentService.getCommentHistory(query, id);
    }
    async create(answerDto, req) {
        const userId = req["user"]["sub"];
        if ((answerDto.answer_id && answerDto.question_id) ||
            (!answerDto.answer_id && !answerDto.question_id)) {
            throw new common_1.BadRequestException("Either answer_id or question_id should be provided, not both or none.");
        }
        if (answerDto.answer_id && !answerDto.question_id)
            await this.answerService.findOneById(answerDto.answer_id);
        if (!answerDto.answer_id && answerDto.question_id)
            await this.questionService.findOneById(answerDto.question_id);
        return this.commentService.createWithActivity(answerDto, userId);
    }
    async update(id, commentDto, req) {
        const ability = this.caslAbilityFactory.createForUser(req["user"]);
        const comment = await this.commentService.findOneById(id);
        if (!comment) {
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.COMMENT);
        }
        if (ability.can(action_enum_1.Action.Update, comment)) {
            return this.commentService.updateWithActivity(id, commentDto, comment, req["user"]["sub"]);
        }
        else {
            throw new common_1.ForbiddenException(message_constants_1.message.NOT_AUTHOR.COMMENT);
        }
    }
    async remove(id, req) {
        const ability = this.caslAbilityFactory.createForUser(req["user"]);
        const comment = await this.commentService.findOneById(id);
        if (!comment) {
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.COMMENT);
        }
        if (ability.can(action_enum_1.Action.Delete, comment)) {
            return this.commentService.removeWithActivity(comment, req["user"]["sub"]);
        }
        else {
            throw new common_1.ForbiddenException(message_constants_1.message.NOT_AUTHOR.COMMENT);
        }
    }
};
exports.CommentController = CommentController;
__decorate([
    (0, nestjs_paginate_1.ApiOkPaginatedResponse)(question_entity_1.Question, comment_pagination_1.commentPaginateConfig),
    (0, nestjs_paginate_1.ApiPaginationQuery)(comment_pagination_1.commentPaginateConfig),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(),
    __param(0, (0, common_1.Query)("answer_id")),
    __param(1, (0, nestjs_paginate_1.Paginate)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "find", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get comment",
    }),
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "findOneById", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get comment history",
    }),
    (0, common_1.Get)(":id/history"),
    (0, common_1.UseGuards)(),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, nestjs_paginate_1.Paginate)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "findHistory", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "create comment",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_comment_dto_1.CreateCommentDto, Request]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "update answer",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_comment_dto_1.UpdateCommentDto,
        Request]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "delete comment",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Request]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "remove", null);
exports.CommentController = CommentController = __decorate([
    (0, swagger_1.ApiTags)("comment"),
    (0, common_1.Controller)("comment"),
    __metadata("design:paramtypes", [comment_service_1.CommentService,
        casl_ability_factory_1.CaslAbilityFactory,
        answer_service_1.AnswerService,
        question_service_1.QuestionService])
], CommentController);
//# sourceMappingURL=comment.controller.js.map