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
exports.Bookmark = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../../users/entity/users.entity");
const answer_entity_1 = require("../../answer/entity/answer.entity");
const question_entity_1 = require("../../question/entity/question.entity");
const reputation_enum_1 = require("../../enums/reputation.enum");
const collection_entity_1 = require("../../collection/enity/collection.entity");
let Bookmark = class Bookmark {
};
exports.Bookmark = Bookmark;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Bookmark.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: reputation_enum_1.ObjectActivityTypeEnum, nullable: true }),
    __metadata("design:type", String)
], Bookmark.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => answer_entity_1.Answer, (answer) => answer.bookmarks, {
        onDelete: "CASCADE",
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: "answer_id" }),
    __metadata("design:type", answer_entity_1.Answer)
], Bookmark.prototype, "answer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => question_entity_1.Question, (question) => question.bookmarks, {
        onDelete: "CASCADE",
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: "question_id" }),
    __metadata("design:type", question_entity_1.Question)
], Bookmark.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.bookmarks, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", users_entity_1.User)
], Bookmark.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Bookmark.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Bookmark.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => collection_entity_1.Collection, (co) => co.bookmarks, {
        onDelete: "CASCADE",
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: "collection_id" }),
    __metadata("design:type", collection_entity_1.Collection)
], Bookmark.prototype, "collection", void 0);
exports.Bookmark = Bookmark = __decorate([
    (0, typeorm_1.Entity)()
], Bookmark);
//# sourceMappingURL=bookmark.entity.js.map