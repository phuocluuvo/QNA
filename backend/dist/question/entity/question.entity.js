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
exports.Question = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../../users/entity/users.entity");
const answer_entity_1 = require("../../answer/entity/answer.entity");
const vote_entity_1 = require("../../vote/entity/vote.entity");
const tag_entity_1 = require("../../tag/entity/tag.entity");
const question_type_enum_1 = require("../../enums/question-type.enum");
const activity_entity_1 = require("../../activity/entity/activity.entity");
const question_state_enum_1 = require("../../enums/question-state.enum");
const comment_entity_1 = require("../../comment/entity/comment.entity");
const bookmark_entity_1 = require("../../bookmark/entity/bookmark.entity");
const history_entity_1 = require("../../history/entity/history.entity");
let Question = class Question {
};
exports.Question = Question;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Question.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 300 }),
    __metadata("design:type", String)
], Question.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Question.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Question.prototype, "views", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Question.prototype, "votes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Question.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Question.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: question_state_enum_1.QuestionState, default: question_state_enum_1.QuestionState.PENDING }),
    __metadata("design:type", String)
], Question.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.questions),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", users_entity_1.User)
], Question.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => answer_entity_1.Answer, (answer) => answer.question),
    __metadata("design:type", Array)
], Question.prototype, "answers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, (comment) => comment.question),
    __metadata("design:type", Array)
], Question.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vote_entity_1.Vote, (vote) => vote.question),
    __metadata("design:type", Array)
], Question.prototype, "vote", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => tag_entity_1.Tag, (tag) => tag.questions),
    (0, typeorm_1.JoinTable)({
        name: "question_tag",
        joinColumn: {
            name: "question_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "tag_id",
            referencedColumnName: "id",
        },
    }),
    __metadata("design:type", Array)
], Question.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => activity_entity_1.Activity, (activity) => activity.question),
    __metadata("design:type", Array)
], Question.prototype, "activity", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bookmark_entity_1.Bookmark, (bk) => bk.question),
    __metadata("design:type", Array)
], Question.prototype, "bookmarks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => history_entity_1.History, (history) => history.question),
    __metadata("design:type", Array)
], Question.prototype, "histories", void 0);
__decorate([
    (0, typeorm_1.VirtualColumn)({
        query: (alias) => `SELECT COUNT(*)
             FROM answer
             WHERE answer.question_id = ${alias}.id`,
    }),
    __metadata("design:type", Number)
], Question.prototype, "answersNumber", void 0);
__decorate([
    (0, typeorm_1.VirtualColumn)({
        query: (alias) => `SELECT CASE
                        WHEN EXISTS (SELECT 1 FROM answer WHERE question_id = ${alias}.id) THEN
                            CASE
                                WHEN EXISTS (SELECT 1 FROM answer WHERE question_id = ${alias}.id AND is_approved = 1)
                                    THEN 'normal'
                                ELSE 'no_approved'
                                END
                        ELSE 'no_answer'
                        END AS result`,
    }),
    __metadata("design:type", String)
], Question.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.VirtualColumn)({
        query: (alias) => `COALESCE(
        (SELECT JSON_ARRAYAGG(t.name)
         FROM tag AS t
         JOIN question_tag AS qt ON t.id = qt.tag_id
         WHERE qt.question_id = ${alias}.id),
        JSON_ARRAY()
      )`,
    }),
    __metadata("design:type", Array)
], Question.prototype, "tagNames", void 0);
exports.Question = Question = __decorate([
    (0, typeorm_1.Entity)()
], Question);
//# sourceMappingURL=question.entity.js.map