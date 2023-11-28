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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const create_user_dto_1 = require("../users/dto/create-user.dto");
const login_user_dto_1 = require("../users/dto/login-user.dto");
const accessToken_guard_1 = require("./guards/accessToken.guard");
const refreshToken_guard_1 = require("./guards/refreshToken.guard");
const passport_1 = require("@nestjs/passport");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signup(createUserDto) {
        return this.authService.signUp(createUserDto);
    }
    async signin(data) {
        return this.authService.signIn(data);
    }
    async logout(req) {
        const userId = req.user["sub"];
        this.authService.logout(userId);
    }
    refreshTokens(req) {
        const userId = req.user["sub"];
        const refreshToken = req.user["refreshToken"];
        return this.authService.refreshTokens(userId, refreshToken);
    }
    refreshTokensV2(data) {
        return this.authService.refreshTokensV2(data.refreshToken);
    }
    async googleAuth() { }
    async googleAuthRedirect(req, res) {
        const info = await this.authService.signInWithGoogle(req.user);
        if (info.refreshToken) {
            res.redirect(`${process.env.URL_WEB}/auth/signin/?refreshToken=${info.refreshToken}`);
        }
        else {
            res.redirect(`${process.env.URL_WEB}/auth/signin/?error=1`);
        }
    }
    async githubAuth() { }
    async githubAuthRedirect(req, res) {
        const info = await this.authService.signInWithGithub(req.user);
        if (info.refreshToken) {
            res.redirect(`${process.env.URL_WEB}/auth/signin/?refreshToken=${info.refreshToken}`);
        }
        else {
            res.redirect(`${process.env.URL_WEB}/auth/signin/?error=1`);
        }
    }
    async forgotPassword(username) {
        return this.authService.forgotPassword(username);
    }
    async resetPassword(uuid, password) {
        return this.authService.resetPassword(uuid, password);
    }
    async checkUserExists(username) {
        return this.authService.checkUserExists(username);
    }
    async confirmPassword(req, password) {
        const userId = req.user["sub"];
        return this.authService.confirmPassword(userId, password);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Login as a user",
    }),
    (0, common_1.Post)("signup"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Register as a user",
    }),
    (0, common_1.Post)("signin"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signin", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Logout as a user",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.Get)("logout"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Refresh token",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(refreshToken_guard_1.RefreshTokenGuard),
    (0, common_1.Post)("refresh"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refreshTokens", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Refresh token v2",
    }),
    (0, common_1.Post)("refresh-v2"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refreshTokensV2", null);
__decorate([
    (0, common_1.Get)("/google"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("google")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)("/google/callback"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("google")),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, common_1.Get)("/github"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("github")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "githubAuth", null);
__decorate([
    (0, common_1.Get)("/github/callback"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("github")),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "githubAuthRedirect", null);
__decorate([
    (0, common_1.Post)("/forgot-password"),
    __param(0, (0, common_1.Query)("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)("/reset-password"),
    __param(0, (0, common_1.Body)("uuid")),
    __param(1, (0, common_1.Body)("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)("/exists"),
    __param(0, (0, common_1.Query)("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkUserExists", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.Get)("/confirm-password"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map