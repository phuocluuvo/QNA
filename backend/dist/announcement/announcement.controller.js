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
exports.AnnouncementController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const accessToken_guard_1 = require("../auth/guards/accessToken.guard");
const route_params_decorator_1 = require("@nestjs/common/decorators/http/route-params.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const role_enum_1 = require("../enums/role.enum");
const public_guard_1 = require("../auth/guards/public.guard");
const announcement_service_1 = require("./announcement.service");
const roles_decorator_1 = require("../auth/decorator/roles.decorator");
const update_announcement_dto_1 = require("./dto/update-announcement.dto");
const create_announcement_dto_1 = require("./dto/create-announcement.dto");
const find_announcement_dto_1 = require("./dto/find-announcement.dto");
let AnnouncementController = class AnnouncementController {
    constructor(announcementService) {
        this.announcementService = announcementService;
    }
    async createAnnouncement(req, createAnnouncementDto) {
        return this.announcementService.create(createAnnouncementDto);
    }
    async updateAnnouncement(req, updateAnnouncementDto, id) {
        return this.announcementService.update(id, updateAnnouncementDto);
    }
    async getAllAnnouncement(query, findAnnouncementDto) {
        return this.announcementService.getAll(query, findAnnouncementDto);
    }
    async getAllAnnouncementForUser(query, findAnnouncementDto) {
        return this.announcementService.getAllForUser(query, findAnnouncementDto);
    }
    async getDetailAnnouncement(id) {
        return this.announcementService.getOne(id);
    }
    async deleteAnnouncement(req, id) {
        return this.announcementService.delete(id);
    }
};
exports.AnnouncementController = AnnouncementController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "create announcement",
    }),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, route_params_decorator_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request,
        create_announcement_dto_1.CreateAnnouncementDto]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "createAnnouncement", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "update announcement",
    }),
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, route_params_decorator_1.Body)()),
    __param(2, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request,
        update_announcement_dto_1.UpdateAnnouncementDto, String]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "updateAnnouncement", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get all announcement",
    }),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(public_guard_1.PublicGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, find_announcement_dto_1.FindAnnouncementDto]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "getAllAnnouncement", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get all announcement for user",
    }),
    (0, common_1.Get)("/user"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, find_announcement_dto_1.FindAnnouncementDto]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "getAllAnnouncementForUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get detail announcement",
    }),
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(public_guard_1.PublicGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.USER, role_enum_1.Role.MONITOR),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "getDetailAnnouncement", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "delete announcement",
    }),
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, String]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "deleteAnnouncement", null);
exports.AnnouncementController = AnnouncementController = __decorate([
    (0, common_1.Controller)("announcement"),
    (0, swagger_1.ApiTags)("announcement"),
    __metadata("design:paramtypes", [announcement_service_1.AnnouncementService])
], AnnouncementController);
//# sourceMappingURL=announcement.controller.js.map