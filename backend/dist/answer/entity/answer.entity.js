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
exports.Answer = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../../users/entity/users.entity");
const question_entity_1 = require("../../question/entity/question.entity");
const vote_entity_1 = require("../../vote/entity/vote.entity");
const comment_entity_1 = require("../../comment/entity/comment.entity");
const activity_entity_1 = require("../../activity/entity/activity.entity");
const bookmark_entity_1 = require("../../bookmark/entity/bookmark.entity");
const history_entity_1 = require("../../history/entity/history.entity");
let Answer = class Answer {
};
exports.Answer = Answer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Answer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Answer.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Answer.prototype, "votes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_approved", default: false }),
    __metadata("design:type", Boolean)
], Answer.prototype, "isApproved", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Answer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Answer.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: "deleted_at" }),
    __metadata("design:type", Date)
], Answer.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => question_entity_1.Question, (question) => question.answers, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "question_id" }),
    __metadata("design:type", question_entity_1.Question)
], Answer.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.answers, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", users_entity_1.User)
], Answer.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vote_entity_1.Vote, (vote) => vote.answer),
    __metadata("design:type", Array)
], Answer.prototype, "vote", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, (comment) => comment.answer),
    __metadata("design:type", Array)
], Answer.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => activity_entity_1.Activity, (activity) => activity.answer),
    __metadata("design:type", Array)
], Answer.prototype, "activity", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bookmark_entity_1.Bookmark, (bk) => bk.answer),
    __metadata("design:type", Array)
], Answer.prototype, "bookmarks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => history_entity_1.History, (history) => history.answer),
    __metadata("design:type", Array)
], Answer.prototype, "histories", void 0);
__decorate([
    (0, typeorm_1.VirtualColumn)({
        query: (alias) => `SELECT COUNT(*)
             FROM comment
             WHERE comment.answer_id = ${alias}.id`,
    }),
    __metadata("design:type", Number)
], Answer.prototype, "commentsNumber", void 0);
exports.Answer = Answer = __decorate([
    (0, typeorm_1.Entity)()
], Answer);
//# sourceMappingURL=answer.entity.js.map