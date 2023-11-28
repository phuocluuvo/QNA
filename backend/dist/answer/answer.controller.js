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
exports.AnswerController = void 0;
const common_1 = require("@nestjs/common");
const casl_ability_factory_1 = require("../casl/casl-ability.factory");
const answer_service_1 = require("./answer.service");
const swagger_1 = require("@nestjs/swagger");
const accessToken_guard_1 = require("../auth/guards/accessToken.guard");
const create_answer_dto_1 = require("./dto/create-answer.dto");
const question_service_1 = require("../question/question.service");
const update_answer_dto_1 = require("./dto/update-answer.dto");
const action_enum_1 = require("../enums/action.enum");
const vote_answer_dto_1 = require("../vote/dto/vote-answer.dto");
const approve_answer_dto_1 = require("./dto/approve-answer.dto");
const public_guard_1 = require("../auth/guards/public.guard");
const message_constants_1 = require("../constants/message.constants");
const nestjs_paginate_1 = require("nestjs-paginate");
const question_entity_1 = require("../question/entity/question.entity");
const answer_pagination_config_1 = require("../config/pagination/answer-pagination.config");
let AnswerController = class AnswerController {
    constructor(answerService, caslAbilityFactory, questionService) {
        this.answerService = answerService;
        this.caslAbilityFactory = caslAbilityFactory;
        this.questionService = questionService;
    }
    find(questionId, req, query) {
        const userId = req.user["sub"];
        return this.answerService.find(questionId, userId, query);
    }
    async findOneById(id) {
        return this.answerService.findOneById(id);
    }
    async findHistory(id, query) {
        return this.answerService.getAnswerHistory(query, id);
    }
    async create(answerDto, req) {
        const userId = req.user["sub"];
        const question = await this.questionService.findOneById(answerDto.question_id);
        if (question) {
            return this.answerService.createWithActivity(answerDto, userId);
        }
    }
    async update(id, answerDto, req) {
        const ability = this.caslAbilityFactory.createForUser(req.user);
        const answer = await this.answerService.findOneById(id);
        if (!answer) {
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.ANSWER);
        }
        if (ability.can(action_enum_1.Action.Update, answer)) {
            return this.answerService.updateWithActivity(id, answerDto, answer, req.user["sub"]);
        }
        else {
            throw new common_1.ForbiddenException(message_constants_1.message.NOT_AUTHOR.ANSWER);
        }
    }
    async remove(id, req) {
        const ability = this.caslAbilityFactory.createForUser(req.user);
        const answer = await this.answerService.findOneById(id);
        if (!answer) {
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.ANSWER);
        }
        if (ability.can(action_enum_1.Action.Delete, answer)) {
            return this.answerService.removeWithActivity(answer, req.user["sub"]);
        }
        else {
            throw new common_1.ForbiddenException(message_constants_1.message.NOT_AUTHOR.ANSWER);
        }
    }
    async vote(answerVoteDto, req) {
        const userId = req.user["sub"];
        return this.answerService.updateVote(userId, answerVoteDto);
    }
    async approve(approveAnswerDto, req) {
        const ability = this.caslAbilityFactory.createForUser(req.user);
        const answer = await this.answerService.findOneById(approveAnswerDto.answer_id);
        const question = await this.questionService.findOneById(approveAnswerDto.question_id);
        if (ability.can(action_enum_1.Action.Update, question)) {
            return this.answerService.approveAnswerWithActivity(approveAnswerDto, answer);
        }
        else {
            throw new common_1.ForbiddenException(message_constants_1.message.NOT_AUTHOR.QUESTION);
        }
    }
};
exports.AnswerController = AnswerController;
__decorate([
    (0, nestjs_paginate_1.ApiOkPaginatedResponse)(question_entity_1.Question, answer_pagination_config_1.answerPaginateConfig),
    (0, nestjs_paginate_1.ApiPaginationQuery)(answer_pagination_config_1.answerPaginateConfig),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(public_guard_1.PublicGuard),
    __param(0, (0, common_1.Query)("question_id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, nestjs_paginate_1.Paginate)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AnswerController.prototype, "find", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get answer",
    }),
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnswerController.prototype, "findOneById", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get answer history",
    }),
    (0, common_1.Get)(":id/history"),
    (0, common_1.UseGuards)(),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, nestjs_paginate_1.Paginate)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnswerController.prototype, "findHistory", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "create answer",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_answer_dto_1.CreateAnswerDto, Object]),
    __metadata("design:returntype", Promise)
], AnswerController.prototype, "create", null);
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
    __metadata("design:paramtypes", [String, update_answer_dto_1.UpdateAnswerDto, Object]),
    __metadata("design:returntype", Promise)
], AnswerController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "delete answer",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnswerController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "vote answer",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)("vote"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vote_answer_dto_1.VoteAnswerDto, Object]),
    __metadata("design:returntype", Promise)
], AnswerController.prototype, "vote", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "approve answer",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)("approve"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [approve_answer_dto_1.ApproveAnswerDto, Object]),
    __metadata("design:returntype", Promise)
], AnswerController.prototype, "approve", null);
exports.AnswerController = AnswerController = __decorate([
    (0, swagger_1.ApiTags)("answer"),
    (0, common_1.Controller)("answer"),
    __metadata("design:paramtypes", [answer_service_1.AnswerService,
        casl_ability_factory_1.CaslAbilityFactory,
        question_service_1.QuestionService])
], AnswerController);
//# sourceMappingURL=answer.controller.js.map