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
exports.SysconfigController = void 0;
const common_1 = require("@nestjs/common");
const sysconfig_service_1 = require("./sysconfig.service");
const update_sysconfig_dto_1 = require("./dto/update-sysconfig.dto");
const create_sysconfig_dto_1 = require("./dto/create-sysconfig.dto");
const accessToken_guard_1 = require("../auth/guards/accessToken.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorator/roles.decorator");
const role_enum_1 = require("../enums/role.enum");
const swagger_1 = require("@nestjs/swagger");
let SysconfigController = class SysconfigController {
    constructor(sysconfigService) {
        this.sysconfigService = sysconfigService;
    }
    async findAll() {
        return await this.sysconfigService.findAll();
    }
    async findOne(id) {
        return await this.sysconfigService.findOne(id);
    }
    async create(sysconfigDto, req) {
        return await this.sysconfigService.create(sysconfigDto, req["user"]["sub"]);
    }
    async update(id, sysconfigDto, userId) {
        await this.sysconfigService.findOne(id);
        return await this.sysconfigService.update(id, sysconfigDto, userId);
    }
    async delete(id) {
        return await this.sysconfigService.delete(id);
    }
};
exports.SysconfigController = SysconfigController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get all sysconfig" }),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SysconfigController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get one sysconfig" }),
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysconfigController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create sysconfig" }),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sysconfig_dto_1.CreateSysconfigDto, Request]),
    __metadata("design:returntype", Promise)
], SysconfigController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update sysconfig" }),
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sysconfig_dto_1.UpdateSysconfigDto, String]),
    __metadata("design:returntype", Promise)
], SysconfigController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Delete sysconfig" }),
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysconfigController.prototype, "delete", null);
exports.SysconfigController = SysconfigController = __decorate([
    (0, common_1.Controller)("sysconfig"),
    (0, swagger_1.ApiTags)("sysconfig"),
    __metadata("design:paramtypes", [sysconfig_service_1.SysconfigService])
], SysconfigController);
//# sourceMappingURL=sysconfig.controller.js.map