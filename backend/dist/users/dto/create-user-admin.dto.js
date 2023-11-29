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
exports.CreateUserAdminDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const user_state_enum_1 = require("../../enums/user-state.enum");
const role_enum_1 = require("../../enums/role.enum");
class CreateUserAdminDto {
}
exports.CreateUserAdminDto = CreateUserAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "Username is required",
    }),
    (0, class_validator_1.Length)(6, 20, {
        message: "Username length must be between 6 and 20 characters",
    }),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "Fullname is required",
    }),
    (0, class_validator_1.Length)(6, 50, {
        message: "Fullname length must be between 6 and 50 characters",
    }),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "fullname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "Email is required",
    }),
    (0, class_validator_1.IsString)({
        message: "Email must be a string",
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "facebookLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "githubLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "twitterLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "websiteLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateUserAdminDto.prototype, "dob", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "Password is required",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.Matches)(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: "Password too weak",
    }),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "password", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEnum)(user_state_enum_1.UserState),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "state", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEnum)(role_enum_1.Role),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "about", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateUserAdminDto.prototype, "activityPoint", void 0);
//# sourceMappingURL=create-user-admin.dto.js.map