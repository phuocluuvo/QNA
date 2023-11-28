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
exports.TagController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const accessToken_guard_1 = require("../auth/guards/accessToken.guard");
const message_constants_1 = require("../constants/message.constants");
const tag_service_1 = require("./tag.service");
const create_tag_dto_1 = require("./dto/create-tag.dto");
const nestjs_paginate_1 = require("nestjs-paginate");
const question_entity_1 = require("../question/entity/question.entity");
const tag_pagination_config_1 = require("../config/pagination/tag-pagination.config");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorator/roles.decorator");
const role_enum_1 = require("../enums/role.enum");
const tag_state_enum_1 = require("../enums/tag-state.enum");
const update_tag_dto_1 = require("./dto/update-tag.dto");
const public_guard_1 = require("../auth/guards/public.guard");
let TagController = class TagController {
    constructor(tagService) {
        this.tagService = tagService;
    }
    find(query, req) {
        return this.tagService.find(query, req["user"]);
    }
    async topTagUserByUser(userId) {
        return this.tagService.topTagUserByUser(userId);
    }
    async findOneById(name) {
        return this.tagService.findOneByName(name);
    }
    async create(req, tagDto) {
        const userId = req["user"]["sub"];
        const tag = await this.tagService.findOne({ name: tagDto.name });
        if (!tag) {
            return this.tagService.create(tagDto, userId);
        }
        else {
            throw new common_1.BadRequestException(message_constants_1.message.EXISTED.TAG);
        }
    }
    async update(id, tagDto) {
        const comment = await this.tagService.findOne({ id: id });
        if (!comment) {
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.TAG);
        }
        return this.tagService.update(id, tagDto);
    }
    async remove(id) {
        const tag = await this.tagService.findOne({ id: id });
        if (!tag) {
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.COMMENT);
        }
        return this.tagService.remove(tag);
    }
    async verify(req, tagId) {
        const userId = req["user"]["sub"];
        return this.tagService.censoring(tagId, userId, tag_state_enum_1.TagState.VERIFIED);
    }
};
exports.TagController = TagController;
__decorate([
    (0, nestjs_paginate_1.ApiOkPaginatedResponse)(question_entity_1.Question, tag_pagination_config_1.tagPaginateConfig),
    (0, nestjs_paginate_1.ApiPaginationQuery)(tag_pagination_config_1.tagPaginateConfig),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(public_guard_1.PublicGuard),
    __param(0, (0, nestjs_paginate_1.Paginate)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Request]),
    __metadata("design:returntype", void 0)
], TagController.prototype, "find", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "verify tag",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)("topTagUser/:userId"),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "topTagUserByUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get tag by tag name ",
    }),
    (0, common_1.Get)(":name"),
    (0, common_1.UseGuards)(),
    __param(0, (0, common_1.Param)("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "findOneById", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "create tag",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, create_tag_dto_1.CreateTagDto]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "update tag",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tag_dto_1.UpdateTagDto]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "delete tag",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MONITOR),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "verify tag",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(":tagId/verify"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MONITOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("tagId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, String]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "verify", null);
exports.TagController = TagController = __decorate([
    (0, swagger_1.ApiTags)("tag"),
    (0, common_1.Controller)("tag"),
    __metadata("design:paramtypes", [tag_service_1.TagService])
], TagController);
//# sourceMappingURL=tag.controller.js.map