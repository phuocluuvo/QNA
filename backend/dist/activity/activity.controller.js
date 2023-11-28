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
exports.ActivityController = void 0;
const common_1 = require("@nestjs/common");
const activity_service_1 = require("./activity.service");
const nestjs_paginate_1 = require("nestjs-paginate");
const activity_pagination_1 = require("../config/pagination/activity-pagination");
const swagger_1 = require("@nestjs/swagger");
const accessToken_guard_1 = require("../auth/guards/accessToken.guard");
const activity_entity_1 = require("./entity/activity.entity");
let ActivityController = class ActivityController {
    constructor(activityService) {
        this.activityService = activityService;
    }
    async getActivityHistory(query, req) {
        const userId = req.user["sub"];
        return this.activityService.findByUserId(query, userId);
    }
    async getActivityHistoryByUser(query, id) {
        return this.activityService.findByUserId(query, id);
    }
    async getActivityPointChange(id, date) {
        return this.activityService.getPointChange(id, date);
    }
};
exports.ActivityController = ActivityController;
__decorate([
    (0, nestjs_paginate_1.ApiOkPaginatedResponse)(activity_entity_1.Activity, activity_pagination_1.activityPaginateConfig),
    (0, nestjs_paginate_1.ApiPaginationQuery)(activity_pagination_1.activityPaginateConfig),
    (0, swagger_1.ApiOperation)({
        summary: "get activity history user",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.Get)("history"),
    __param(0, (0, nestjs_paginate_1.Paginate)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "getActivityHistory", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get activity history userId",
    }),
    (0, common_1.Get)("history/:id"),
    __param(0, (0, nestjs_paginate_1.Paginate)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "getActivityHistoryByUser", null);
__decorate([
    (0, common_1.Get)("activityPointChange/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "getActivityPointChange", null);
exports.ActivityController = ActivityController = __decorate([
    (0, common_1.Controller)("activity"),
    (0, swagger_1.ApiTags)("activity"),
    __metadata("design:paramtypes", [activity_service_1.ActivityService])
], ActivityController);
//# sourceMappingURL=activity.controller.js.map