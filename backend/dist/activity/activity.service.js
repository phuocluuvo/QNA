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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const users_service_1 = require("../users/users.service");
const typeorm_transactional_1 = require("typeorm-transactional");
const nestjs_paginate_1 = require("nestjs-paginate");
const activity_pagination_1 = require("../config/pagination/activity-pagination");
const activity_entity_1 = require("./entity/activity.entity");
const reputation_enum_1 = require("../enums/reputation.enum");
const reputation_constants_1 = require("../constants/reputation.constants");
const message_constants_1 = require("../constants/message.constants");
const sysconfig_service_1 = require("../sysconfig/sysconfig.service");
let ActivityService = class ActivityService {
    constructor(activityRepository, usersService, sysconfigService) {
        this.activityRepository = activityRepository;
        this.usersService = usersService;
        this.sysconfigService = sysconfigService;
    }
    async findByUserId(query, id) {
        const queryBuilder = this.activityRepository.createQueryBuilder("activity");
        queryBuilder.where({ user: { id } });
        return (0, nestjs_paginate_1.paginate)(query, queryBuilder, activity_pagination_1.activityPaginateConfig);
    }
    async create(activityType, objectType, objectId, userId, authorId) {
        const repu = await this.transConfigToReputationConstant(activityType);
        const newActivity = new activity_entity_1.Activity();
        newActivity.activityType = activityType;
        newActivity.objectType = objectType;
        newActivity.objectId = objectId;
        newActivity.pointChange = repu;
        newActivity.user = { id: userId };
        switch (objectType) {
            case reputation_enum_1.ObjectActivityTypeEnum.QUESTION:
                newActivity.question = { id: objectId };
                break;
            case reputation_enum_1.ObjectActivityTypeEnum.ANSWER:
                newActivity.answer = { id: objectId };
                break;
            case reputation_enum_1.ObjectActivityTypeEnum.COMMENT:
                newActivity.comment = { id: objectId };
                break;
            case reputation_enum_1.ObjectActivityTypeEnum.VOTE_QUESTION:
                newActivity.question = { id: objectId };
                break;
            case reputation_enum_1.ObjectActivityTypeEnum.VOTE_ANSWER:
                newActivity.answer = { id: objectId };
                break;
        }
        const activity = await this.activityRepository.save(newActivity);
        await this.usersService.updateActivityPoint(authorId, repu);
        return activity;
    }
    async checkCreateQuestion(userId) {
        const sysconfigUsing = await this.sysconfigService.getUsingSysconfig();
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        let requiredActivity = 3;
        let questionPointCheck = reputation_constants_1.reputationActivityPoint[reputation_enum_1.ReputationActivityTypeEnum.CREATE_QUESTION];
        if (sysconfigUsing) {
            requiredActivity = sysconfigUsing.createQuestionDaily;
            questionPointCheck = sysconfigUsing.questionCreatePointCheck;
        }
        const activity = await this.activityRepository.count({
            where: {
                user: { id: userId },
                activityType: reputation_enum_1.ReputationActivityTypeEnum.CREATE_QUESTION,
                createdAt: (0, typeorm_1.MoreThanOrEqual)(todayStart),
            },
        });
        if (activity >= requiredActivity) {
            const user = await this.usersService.findById(userId);
            const pointCheck = (activity + 1) * questionPointCheck;
            return user.activityPoint > pointCheck;
        }
        return true;
    }
    async syncPointDelete(objectId, userId) {
        const activity = await this.activityRepository.find({
            where: {
                user: { id: userId },
                objectId,
            },
        });
        const pointChange = activity.reduce((a, b) => a + b.pointChange, 0);
        return this.usersService.updateActivityPoint(userId, -pointChange);
    }
    async getPointChange(userId, date) {
        const user = await this.usersService.find({
            id: userId,
        });
        if (!user) {
            throw new common_1.BadRequestException(message_constants_1.message.NOT_FOUND.USER);
        }
        const queryBuiler = await this.activityRepository.createQueryBuilder("activity");
        queryBuiler.select([
            "DATE(activity.createdAt) AS activity_date",
            "SUM(activity.pointChange) AS total_points",
        ]);
        queryBuiler.where({ user: { id: userId } });
        if (date != "all") {
            const datet = new Date(date);
            if (isNaN(datet.getTime())) {
                throw new common_1.BadRequestException();
            }
            queryBuiler.andWhere("activity.createdAt >= :date", { date });
        }
        queryBuiler.groupBy("activity_date");
        const result = await queryBuiler.getRawMany();
        let cur_point = user.activityPoint;
        for (let i = result.length - 1; i >= 0; i--) {
            result[i].total_points = cur_point - result[i].total_points;
            cur_point = result[i].total_points;
        }
        return result;
    }
    async transConfigToReputationConstant(activityType) {
        const sysconfigUsing = await this.sysconfigService.getUsingSysconfig();
        if (sysconfigUsing) {
            const reputation = {
                [reputation_enum_1.ReputationActivityTypeEnum.CREATE_QUESTION]: sysconfigUsing.createQuestion,
                [reputation_enum_1.ReputationActivityTypeEnum.UPDATE_QUESTION]: sysconfigUsing.updateQuestion,
                [reputation_enum_1.ReputationActivityTypeEnum.CREATE_ANSWER]: sysconfigUsing.createAnswer,
                [reputation_enum_1.ReputationActivityTypeEnum.UPDATE_ANSWER]: sysconfigUsing.updateAnswer,
                [reputation_enum_1.ReputationActivityTypeEnum.CREATE_COMMENT]: sysconfigUsing.createComment,
                [reputation_enum_1.ReputationActivityTypeEnum.UPDATE_COMMENT]: sysconfigUsing.updateComment,
                [reputation_enum_1.ReputationActivityTypeEnum.UPVOTE]: sysconfigUsing.upVote,
                [reputation_enum_1.ReputationActivityTypeEnum.CANCLE_UPVOTE]: sysconfigUsing.cancleUpVote,
                [reputation_enum_1.ReputationActivityTypeEnum.CHANGE_DOWNVOTE_TO_UPVOTE]: sysconfigUsing.changeDownVoteToUpVote,
                [reputation_enum_1.ReputationActivityTypeEnum.ACCEPT_ANSWER]: sysconfigUsing.acceptAnswer,
                [reputation_enum_1.ReputationActivityTypeEnum.DELETE_QUESTION]: sysconfigUsing.deleteQuestion,
                [reputation_enum_1.ReputationActivityTypeEnum.DELETE_ANSWER]: sysconfigUsing.deleteAnswer,
                [reputation_enum_1.ReputationActivityTypeEnum.DELETE_COMMENT]: sysconfigUsing.deleteComment,
                [reputation_enum_1.ReputationActivityTypeEnum.DOWNVOTE]: sysconfigUsing.downVote,
                [reputation_enum_1.ReputationActivityTypeEnum.CANCLE_DOWNVOTE]: sysconfigUsing.cancleDownVote,
                [reputation_enum_1.ReputationActivityTypeEnum.CHANGE_UPVOTE_TO_DOWNVOTE]: sysconfigUsing.changeUpVoteToDownVote,
                [reputation_enum_1.ReputationActivityTypeEnum.UN_ACCEPT_ANSWER]: sysconfigUsing.unAcceptAnswer,
                [reputation_enum_1.ReputationActivityTypeEnum.BLOCK_QUESTION]: sysconfigUsing.blockQuestion,
                [reputation_enum_1.ReputationActivityTypeEnum.VERIFY_QUESTION]: sysconfigUsing.verifyQuestion,
                [reputation_enum_1.ReputationActivityTypeEnum.VERIFY_TAG]: sysconfigUsing.verifyTag,
                [reputation_enum_1.ReputationActivityTypeEnum.UN_BLOCK_QUESTION]: sysconfigUsing.unBlockQuestion,
            };
            return reputation[activityType];
        }
        else {
            return reputation_constants_1.reputationActivityPoint[activityType];
        }
    }
    async checkUndeleteQuestion(questionId) {
        const requiredActivity = 10;
        const activity = await this.countUnblockQuestion(questionId);
        return activity < requiredActivity;
    }
    async countUnblockQuestion(questionId) {
        const activityType = reputation_enum_1.ReputationActivityTypeEnum.UN_BLOCK_QUESTION;
        return await this.activityRepository.count({
            where: {
                question: { id: questionId },
                activityType: activityType,
            },
        });
    }
};
exports.ActivityService = ActivityService;
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ActivityService.prototype, "create", null);
exports.ActivityService = ActivityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("ACTIVITY_REPOSITORY")),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        users_service_1.UsersService,
        sysconfig_service_1.SysconfigService])
], ActivityService);
//# sourceMappingURL=activity.service.js.map