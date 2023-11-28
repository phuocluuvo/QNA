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
exports.QuestionController = void 0;
const common_1 = require("@nestjs/common");
const question_entity_1 = require("./entity/question.entity");
const question_service_1 = require("./question.service");
const create_question_dto_1 = require("./dto/create-question.dto");
const update_question_dto_1 = require("./dto/update-question.dto");
const swagger_1 = require("@nestjs/swagger");
const accessToken_guard_1 = require("../auth/guards/accessToken.guard");
const action_enum_1 = require("../enums/action.enum");
const casl_ability_factory_1 = require("../casl/casl-ability.factory");
const vote_question_dto_1 = require("../vote/dto/vote-question.dto");
const public_guard_1 = require("../auth/guards/public.guard");
const message_constants_1 = require("../constants/message.constants");
const nestjs_paginate_1 = require("nestjs-paginate");
const question_pagination_config_1 = require("../config/pagination/question-pagination.config");
const role_enum_1 = require("../enums/role.enum");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorator/roles.decorator");
const question_state_enum_1 = require("../enums/question-state.enum");
let QuestionController = class QuestionController {
    constructor(questionService, caslAbilityFactory) {
        this.questionService = questionService;
        this.caslAbilityFactory = caslAbilityFactory;
    }
    find(query, tagNames, req) {
        const user = req.user ? req.user : null;
        return this.questionService.find(query, tagNames, user);
    }
    async getRelated(query, tagNames) {
        return this.questionService.related(query, tagNames);
    }
    async findOneById(id, req) {
        const ability = this.caslAbilityFactory.createForUser(req.user);
        const question = await this.questionService.findOneById(id);
        if (question.state == question_state_enum_1.QuestionState.BLOCKED &&
            !ability.can(action_enum_1.Action.Update, question)) {
            throw new common_1.ForbiddenException(message_constants_1.message.NOT_FOUND.QUESTION);
        }
        return this.questionService.getQuestionAndIncreaseViewCount(id, req.user["sub"]);
    }
    async findHistory(id, query) {
        return this.questionService.getQuestionHistory(query, id);
    }
    create(questionDto, req) {
        const userId = req.user["sub"];
        return this.questionService.createWithActivity(questionDto, userId);
    }
    async update(id, questionDto, req) {
        const ability = this.caslAbilityFactory.createForUser(req.user);
        const question = await this.questionService.findOneById(id);
        if (!question) {
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.QUESTION);
        }
        if (ability.can(action_enum_1.Action.Update, question)) {
            return this.questionService.updateWithActivity(id, questionDto, question, req.user["sub"]);
        }
        else {
            throw new common_1.ForbiddenException(message_constants_1.message.NOT_AUTHOR.QUESTION);
        }
    }
    async remove(id, req) {
        const ability = this.caslAbilityFactory.createForUser(req.user);
        const question = await this.questionService.findOneById(id);
        if (!question) {
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.QUESTION);
        }
        if (ability.can(action_enum_1.Action.Delete, question)) {
            return this.questionService.removeWithActivity(question, req.user["sub"]);
        }
        else {
            throw new common_1.ForbiddenException(message_constants_1.message.NOT_AUTHOR.QUESTION);
        }
    }
    async vote(questionVoteDto, req) {
        const userId = req.user["sub"];
        return this.questionService.updateVote(userId, questionVoteDto);
    }
    async verify(req, questionId) {
        const userId = req.user["sub"];
        return this.questionService.censoring(questionId, userId, question_state_enum_1.QuestionState.VERIFIED);
    }
    async block(req, questionId) {
        const userId = req.user["sub"];
        return this.questionService.censoring(questionId, userId, question_state_enum_1.QuestionState.BLOCKED);
    }
    async undelete(req, questionId) {
        const userId = req.user["sub"];
        const ability = this.caslAbilityFactory.createForUser(req.user);
        const question = await this.questionService.findOneById(questionId);
        if (!(await this.questionService.checkReport(question.id))) {
            throw new common_1.BadRequestException(message_constants_1.message.CANNOT_UN_BLOCK_OVER_MANY_TIMES);
        }
        if (ability.can(action_enum_1.Action.Delete, question)) {
            return this.questionService.censoring(questionId, userId, question_state_enum_1.QuestionState.PENDING);
        }
        else {
            throw new common_1.ForbiddenException(message_constants_1.message.NOT_AUTHOR.QUESTION);
        }
    }
    async getCounUnBlock(questionId) {
        return await this.questionService.getCountReport(questionId);
    }
    async replaceTag(newTag, oldTag) {
        return this.questionService.replaceTag(newTag, oldTag);
    }
};
exports.QuestionController = QuestionController;
__decorate([
    (0, nestjs_paginate_1.ApiOkPaginatedResponse)(question_entity_1.Question, question_pagination_config_1.questionPaginateConfig),
    (0, nestjs_paginate_1.ApiPaginationQuery)(question_pagination_config_1.questionPaginateConfig),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(public_guard_1.PublicGuard),
    __param(0, (0, nestjs_paginate_1.Paginate)()),
    __param(1, (0, common_1.Query)("filter.tags")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], QuestionController.prototype, "find", null);
__decorate([
    (0, nestjs_paginate_1.ApiOkPaginatedResponse)(question_entity_1.Question, question_pagination_config_1.questionPaginateConfig),
    (0, nestjs_paginate_1.ApiPaginationQuery)(question_pagination_config_1.questionPaginateConfig),
    (0, swagger_1.ApiOperation)({
        summary: "related question",
    }),
    (0, common_1.Get)("/related"),
    (0, common_1.UseGuards)(),
    __param(0, (0, nestjs_paginate_1.Paginate)()),
    __param(1, (0, common_1.Query)("tag_names")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "getRelated", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get question",
    }),
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(public_guard_1.PublicGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "findOneById", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get question history",
    }),
    (0, common_1.Get)(":id/history"),
    (0, common_1.UseGuards)(),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, nestjs_paginate_1.Paginate)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "findHistory", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "create question",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_question_dto_1.CreateQuestionDto, Object]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "update question",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_question_dto_1.UpdateQuestionDto, Object]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "delete question",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "vote question",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)("vote"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vote_question_dto_1.VoteQuestionDto, Object]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "vote", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "verify question",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(":questionId/verify"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MONITOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("questionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "verify", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "verify question",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(":questionId/block"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MONITOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("questionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "block", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "verify question",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(":questionId/unblock"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("questionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "undelete", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get count unblock question",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(":questionId/getCountUnblock"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Param)("questionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "getCounUnBlock", null);
__decorate([
    (0, common_1.Put)("replaceTag"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MONITOR),
    __param(0, (0, common_1.Body)("tag_to_replace")),
    __param(1, (0, common_1.Body)("old_tag")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "replaceTag", null);
exports.QuestionController = QuestionController = __decorate([
    (0, swagger_1.ApiTags)("question"),
    (0, common_1.Controller)("question"),
    __metadata("design:paramtypes", [question_service_1.QuestionService,
        casl_ability_factory_1.CaslAbilityFactory])
], QuestionController);
//# sourceMappingURL=question.controller.js.map