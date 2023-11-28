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
exports.User = void 0;
const role_enum_1 = require("../../enums/role.enum");
const typeorm_1 = require("typeorm");
const question_entity_1 = require("../../question/entity/question.entity");
const answer_entity_1 = require("../../answer/entity/answer.entity");
const vote_entity_1 = require("../../vote/entity/vote.entity");
const activity_entity_1 = require("../../activity/entity/activity.entity");
const user_state_enum_1 = require("../../enums/user-state.enum");
const tag_entity_1 = require("../../tag/entity/tag.entity");
const bookmark_entity_1 = require("../../bookmark/entity/bookmark.entity");
const history_entity_1 = require("../../history/entity/history.entity");
const collection_entity_1 = require("../../collection/enity/collection.entity");
const announcement_entity_1 = require("../../announcement/entity/announcement.entity");
const sysconfig_entity_1 = require("../../sysconfig/entity/sysconfig.entity");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], User.prototype, "fullname", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true, default: null }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: null }),
    __metadata("design:type", Date)
], User.prototype, "dob", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: "facebook_link" }),
    __metadata("design:type", String)
], User.prototype, "facebookLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: "github_link" }),
    __metadata("design:type", String)
], User.prototype, "githubLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: "linkedin_link" }),
    __metadata("design:type", String)
], User.prototype, "twitterLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: "website_link" }),
    __metadata("design:type", String)
], User.prototype, "websiteLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: role_enum_1.Role, default: role_enum_1.Role.USER }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "activity_point", nullable: false, default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "activityPoint", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, select: false }),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: user_state_enum_1.UserState,
        default: user_state_enum_1.UserState.ACTIVE,
    }),
    __metadata("design:type", String)
], User.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "uuid_created_at", type: "datetime", nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "uuid_created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "text" }),
    __metadata("design:type", String)
], User.prototype, "about", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "text" }),
    __metadata("design:type", String)
], User.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "more", void 0);
__decorate([
    (0, typeorm_1.VirtualColumn)({
        query: (alias) => `SELECT COUNT(*)
             FROM notification
             WHERE notification.user_id = ${alias}.id
               AND notification.is_read = false`,
    }),
    __metadata("design:type", Number)
], User.prototype, "notificationsNumber", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => question_entity_1.Question, (question) => question.user),
    __metadata("design:type", Array)
], User.prototype, "questions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => answer_entity_1.Answer, (answer) => answer.user),
    __metadata("design:type", Array)
], User.prototype, "answers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vote_entity_1.Vote, (vote) => vote.user),
    __metadata("design:type", Array)
], User.prototype, "votes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => activity_entity_1.Activity, (re) => re.user),
    __metadata("design:type", Array)
], User.prototype, "activities", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tag_entity_1.Tag, (tag) => tag.user),
    __metadata("design:type", Array)
], User.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bookmark_entity_1.Bookmark, (bk) => bk.user),
    __metadata("design:type", Array)
], User.prototype, "bookmarks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => collection_entity_1.Collection, (co) => co.user),
    __metadata("design:type", Array)
], User.prototype, "collections", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => history_entity_1.History, (history) => history.user),
    __metadata("design:type", Array)
], User.prototype, "histories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => announcement_entity_1.Announcement, (a) => a.user),
    __metadata("design:type", Array)
], User.prototype, "announcements", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sysconfig_entity_1.Sysconfig, (a) => a.latestEditUser),
    __metadata("design:type", Array)
], User.prototype, "sysconfigs", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=users.entity.js.map