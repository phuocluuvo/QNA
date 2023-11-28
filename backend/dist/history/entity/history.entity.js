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
exports.History = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../../users/entity/users.entity");
const answer_entity_1 = require("../../answer/entity/answer.entity");
const question_entity_1 = require("../../question/entity/question.entity");
const reputation_enum_1 = require("../../enums/reputation.enum");
const comment_entity_1 = require("../../comment/entity/comment.entity");
let History = class History {
};
exports.History = History;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], History.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: reputation_enum_1.ObjectActivityTypeEnum, nullable: true }),
    __metadata("design:type", String)
], History.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 300, nullable: true, default: null }),
    __metadata("design:type", String)
], History.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], History.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], History.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], History.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => answer_entity_1.Answer, (answer) => answer.histories, {
        onDelete: "CASCADE",
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: "answer_id" }),
    __metadata("design:type", answer_entity_1.Answer)
], History.prototype, "answer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => question_entity_1.Question, (question) => question.histories, {
        onDelete: "CASCADE",
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: "question_id" }),
    __metadata("design:type", question_entity_1.Question)
], History.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => comment_entity_1.Comment, (cmt) => cmt.histories, {
        onDelete: "CASCADE",
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: "comment_id" }),
    __metadata("design:type", comment_entity_1.Comment)
], History.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.histories, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", users_entity_1.User)
], History.prototype, "user", void 0);
exports.History = History = __decorate([
    (0, typeorm_1.Entity)()
], History);
//# sourceMappingURL=history.entity.js.map