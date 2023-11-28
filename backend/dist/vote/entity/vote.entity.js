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
exports.Vote = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../../users/entity/users.entity");
const question_entity_1 = require("../../question/entity/question.entity");
const answer_entity_1 = require("../../answer/entity/answer.entity");
const vote_type_enum_1 = require("../../enums/vote-type.enum");
const activity_entity_1 = require("../../activity/entity/activity.entity");
let Vote = class Vote {
};
exports.Vote = Vote;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Vote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: vote_type_enum_1.VoteType, name: "vote_type" }),
    __metadata("design:type", String)
], Vote.prototype, "voteType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.votes, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", users_entity_1.User)
], Vote.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => question_entity_1.Question, (question) => question.votes, {
        nullable: true,
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "question_id" }),
    __metadata("design:type", question_entity_1.Question)
], Vote.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => answer_entity_1.Answer, (answer) => answer.votes, {
        nullable: true,
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "answer_id" }),
    __metadata("design:type", answer_entity_1.Answer)
], Vote.prototype, "answer", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Vote.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Vote.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => activity_entity_1.Activity, (activity) => activity.comment),
    __metadata("design:type", Array)
], Vote.prototype, "activity", void 0);
exports.Vote = Vote = __decorate([
    (0, typeorm_1.Entity)()
], Vote);
//# sourceMappingURL=vote.entity.js.map