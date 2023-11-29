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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const accessToken_guard_1 = require("../auth/guards/accessToken.guard");
const update_user_dto_1 = require("./dto/update-user.dto");
const class_transformer_1 = require("class-transformer");
const user_dto_1 = require("./dto/user.dto");
const nestjs_paginate_1 = require("nestjs-paginate");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorator/roles.decorator");
const role_enum_1 = require("../enums/role.enum");
const user_pagination_1 = require("../config/pagination/user-pagination");
const users_entity_1 = require("./entity/users.entity");
const create_user_admin_dto_1 = require("./dto/create-user-admin.dto");
const question_type_enum_1 = require("../enums/question-type.enum");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getProfile(req) {
        const user = await this.usersService.getProfile(req.user["sub"]);
        return (0, class_transformer_1.plainToClass)(user_dto_1.UserDto, user, { excludeExtraneousValues: true });
    }
    async confirmEmail(uuid, res) {
        try {
            const result = await this.usersService.confirmEmail(uuid);
            if (result) {
                res.redirect(`${process.env.URL_WEB}/en?addEmail=true`);
            }
            else {
                res.redirect(`${process.env.URL_WEB}/en?addEmail=false`);
            }
        }
        catch (err) {
            res.redirect(`${process.env.URL_WEB}/en?addEmail=false`);
        }
    }
    async update(req, updateUserDto) {
        const id = req.user["sub"];
        const user = await this.usersService.updateProfile(id, updateUserDto);
        return (0, class_transformer_1.plainToClass)(user_dto_1.UserDto, user, {
            excludeExtraneousValues: true,
        });
    }
    async getAllUser(query, state, role) {
        return this.usersService.getAllUser(query, state, role);
    }
    async getInfoUser(id) {
        const user = await this.usersService.getProfile(id);
        return (0, class_transformer_1.plainToClass)(user_dto_1.UserDto, user, { excludeExtraneousValues: true });
    }
    async getInfoUserForAdmin(id) {
        return {
            ...(await this.usersService.getProlifeForAdmin(id)),
            month: await this.usersService.getMoreProfileForAdmin(id, question_type_enum_1.QuestionTimeTypeEnum.MONTH),
            quarter: await this.usersService.getMoreProfileForAdmin(id, question_type_enum_1.QuestionTimeTypeEnum.QUARTER),
            year: await this.usersService.getMoreProfileForAdmin(id, question_type_enum_1.QuestionTimeTypeEnum.YEAR),
            all: await this.usersService.getMoreProfileForAdmin(id),
        };
    }
    async createUserForAdmin(id, createUserDto) {
        const user = await this.usersService.createUserForAdmin(createUserDto);
        return (0, class_transformer_1.plainToClass)(user_dto_1.UserDto, user, {
            excludeExtraneousValues: true,
        });
    }
    async updateUserForAdmin(id, updateUserDto) {
        const user = await this.usersService.updateUserForAdmin(id, updateUserDto);
        return (0, class_transformer_1.plainToClass)(user_dto_1.UserDto, user, {
            excludeExtraneousValues: true,
        });
    }
    async addEmail(req, email) {
        const userId = req.user.sub;
        return this.usersService.AddEmail(userId, email);
    }
    async addActivityPoint(activityPoint) {
        console.log(typeof activityPoint);
        if (typeof activityPoint != "number")
            throw new common_1.BadRequestException("activityPoint must be greater than 0");
        return this.usersService.addActivityPoint(activityPoint);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get profile",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.Get)("profile"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Confirm email for user",
    }),
    (0, common_1.Get)("/confirm-email"),
    __param(0, (0, common_1.Query)("uuid")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "confirmEmail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "update profile user",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.Patch)("profile"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get all user for admin",
    }),
    (0, nestjs_paginate_1.ApiOkPaginatedResponse)(users_entity_1.User, user_pagination_1.userPaginateConfig),
    (0, nestjs_paginate_1.ApiPaginationQuery)(user_pagination_1.userPaginateConfig),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)("filter.state")),
    __param(2, (0, common_1.Query)("filter.role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get one user",
    }),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getInfoUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get one user",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)("info/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getInfoUserForAdmin", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "create user for admin",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_user_admin_dto_1.CreateUserAdminDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUserForAdmin", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "update user for admin",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserForAdmin", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Add email for user",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.Post)("add-email"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addEmail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Add point all user",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Put)("addActivityPoint"),
    __param(0, (0, common_1.Body)("activityPoint")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addActivityPoint", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)("user"),
    (0, common_1.Controller)("user"),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map