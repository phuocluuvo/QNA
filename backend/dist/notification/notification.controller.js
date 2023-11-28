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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notification_service_1 = require("./notification.service");
const accessToken_guard_1 = require("../auth/guards/accessToken.guard");
const message_constants_1 = require("../constants/message.constants");
const notification_dto_1 = require("./dto/notification.dto");
const route_params_decorator_1 = require("@nestjs/common/decorators/http/route-params.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const role_enum_1 = require("../enums/role.enum");
const roles_decorator_1 = require("../auth/decorator/roles.decorator");
const update_notification_dto_1 = require("./dto/update-notification.dto");
const nestjs_paginate_1 = require("nestjs-paginate");
const notification_pagination_1 = require("../config/pagination/notification-pagination");
const notification_entity_1 = require("./entity/notification.entity");
let NotificationController = class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async getNotifications(query, filter, req) {
        return this.notificationService.findByUserId(query, filter, req["user"]["sub"]);
    }
    async getBadgeNumber(req) {
        if (req["user"]) {
            return this.notificationService.getBadgeNumber(req["user"]["sub"]);
        }
        else {
            return -1;
        }
    }
    async getAnnouncement() {
        return this.notificationService.findAnnouncement();
    }
    async readAllNotification(req) {
        return this.notificationService.readAllNotification(req["user"]["sub"]);
    }
    async readNotification(req, id) {
        const notification = this.notificationService.findOneByIdUser(id, req["user"]["sub"]);
        if (notification) {
            const result = await this.notificationService.readNotification(id);
            result["notificationsNumber"] =
                await this.notificationService.getBadgeNumber(req["user"]["sub"]);
            return result;
        }
        else {
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.NOTIFICATION);
        }
    }
    async createAnnouncement(req, notificationDto) {
        return this.notificationService.createAnnouncement(notificationDto);
    }
    async updateAnnouncement(req, notificationDto, id) {
        return this.notificationService.updateAnnouncement(id, notificationDto);
    }
    async deleteAnnouncement(req, id) {
        return this.notificationService.deleteAnnouncement(id);
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, nestjs_paginate_1.ApiOkPaginatedResponse)(notification_entity_1.Notification, notification_pagination_1.notificationPagination),
    (0, nestjs_paginate_1.ApiPaginationQuery)(notification_pagination_1.notificationPagination),
    (0, swagger_1.ApiOperation)({
        summary: "get notification",
    }),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)("filter.isRead")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Request]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotifications", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get announcement count",
    }),
    (0, common_1.Get)("badgeNumber"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getBadgeNumber", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get announcement",
    }),
    (0, common_1.Get)("announcement"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getAnnouncement", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "update is read notification",
    }),
    (0, common_1.Get)("all"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "readAllNotification", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "update is read notification",
    }),
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "readNotification", null);
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
        notification_dto_1.NotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "createAnnouncement", null);
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
        update_notification_dto_1.UpdateNotificationDto, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "updateAnnouncement", null);
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
], NotificationController.prototype, "deleteAnnouncement", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)("notification"),
    (0, swagger_1.ApiTags)("notification"),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map