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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("./dashboard.service");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../auth/decorator/roles.decorator");
const role_enum_1 = require("../enums/role.enum");
const accessToken_guard_1 = require("../auth/guards/accessToken.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getCountQuestion() {
        return this.dashboardService.getCountQuestion();
    }
    async getData() {
        return this.dashboardService.getDataDashboard();
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "count question for dashboard",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)("/count-question"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MONITOR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getCountQuestion", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "data for dashboard",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)("/data"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MONITOR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getData", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)("dashboard"),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map