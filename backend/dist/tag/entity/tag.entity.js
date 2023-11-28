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
exports.Tag = void 0;
const typeorm_1 = require("typeorm");
const question_entity_1 = require("../../question/entity/question.entity");
const tag_state_enum_1 = require("../../enums/tag-state.enum");
const users_entity_1 = require("../../users/entity/users.entity");
let Tag = class Tag {
};
exports.Tag = Tag;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Tag.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Tag.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Tag.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Tag.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Tag.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: tag_state_enum_1.TagState, default: tag_state_enum_1.TagState.PENDING }),
    __metadata("design:type", String)
], Tag.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.VirtualColumn)({
        query: (alias) => `SELECT COUNT(*)
             FROM question_tag
             WHERE question_tag.tag_id = ${alias}.id`,
    }),
    __metadata("design:type", Number)
], Tag.prototype, "questionsNumber", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.tags, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", users_entity_1.User)
], Tag.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => question_entity_1.Question, (question) => question.tags),
    __metadata("design:type", Array)
], Tag.prototype, "questions", void 0);
exports.Tag = Tag = __decorate([
    (0, typeorm_1.Entity)()
], Tag);
//# sourceMappingURL=tag.entity.js.map