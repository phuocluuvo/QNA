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
exports.Sysconfig = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../../users/entity/users.entity");
let Sysconfig = class Sysconfig {
};
exports.Sysconfig = Sysconfig;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Sysconfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "create_question" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "createQuestion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "update_question" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "updateQuestion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "create_answer" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "createAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "update_answer" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "updateAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "create_comment" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "createComment", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "update_comment" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "updateComment", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "up_vote" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "upVote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "cancle_up_vote" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "cancleUpVote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "change_down_vote_to_up_vote" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "changeDownVoteToUpVote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "accept_answer" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "acceptAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "delete_question" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "deleteQuestion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "delete_answer" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "deleteAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "delete_comment" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "deleteComment", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "down_vote" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "downVote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "cancle_down_vote" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "cancleDownVote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "change_up_vote_to_down_vote" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "changeUpVoteToDownVote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "un_accept_answer" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "unAcceptAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "block_question" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "blockQuestion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "un_block_question" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "unBlockQuestion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "verify_question" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "verifyQuestion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "verify_tag" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "verifyTag", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "creat_question_daily" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "createQuestionDaily", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "question_create_point_check" }),
    __metadata("design:type", Number)
], Sysconfig.prototype, "questionCreatePointCheck", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_use" }),
    __metadata("design:type", Boolean)
], Sysconfig.prototype, "isUse", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Sysconfig.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Sysconfig.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.sysconfigs),
    (0, typeorm_1.JoinColumn)({ name: "latest_edit_user_id" }),
    __metadata("design:type", users_entity_1.User)
], Sysconfig.prototype, "latestEditUser", void 0);
exports.Sysconfig = Sysconfig = __decorate([
    (0, typeorm_1.Entity)()
], Sysconfig);
//# sourceMappingURL=sysconfig.entity.js.map