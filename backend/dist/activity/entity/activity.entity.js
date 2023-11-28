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
exports.Activity = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../../users/entity/users.entity");
const notification_entity_1 = require("../../notification/entity/notification.entity");
const question_entity_1 = require("../../question/entity/question.entity");
const answer_entity_1 = require("../../answer/entity/answer.entity");
const comment_entity_1 = require("../../comment/entity/comment.entity");
const vote_entity_1 = require("../../vote/entity/vote.entity");
let Activity = class Activity {
};
exports.Activity = Activity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Activity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "point_change", default: 0 }),
    __metadata("design:type", Number)
], Activity.prototype, "pointChange", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "activity_type" }),
    __metadata("design:type", String)
], Activity.prototype, "activityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "object_type" }),
    __metadata("design:type", String)
], Activity.prototype, "objectType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "object_id" }),
    __metadata("design:type", String)
], Activity.prototype, "objectId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Activity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Activity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.activities, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", users_entity_1.User)
], Activity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, (notification) => notification.activity),
    __metadata("design:type", Array)
], Activity.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => question_entity_1.Question, (question) => question.activity, {
        nullable: true,
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "question_id" }),
    __metadata("design:type", question_entity_1.Question)
], Activity.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => answer_entity_1.Answer, (answer) => answer.activity, {
        nullable: true,
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "answer_id" }),
    __metadata("design:type", answer_entity_1.Answer)
], Activity.prototype, "answer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => comment_entity_1.Comment, (comment) => comment.activity, {
        nullable: true,
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "comment_id" }),
    __metadata("design:type", comment_entity_1.Comment)
], Activity.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vote_entity_1.Vote, (vote) => vote.activity, {
        nullable: true,
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "vote_id" }),
    __metadata("design:type", vote_entity_1.Vote)
], Activity.prototype, "vote", void 0);
exports.Activity = Activity = __decorate([
    (0, typeorm_1.Entity)()
], Activity);
//# sourceMappingURL=activity.entity.js.map