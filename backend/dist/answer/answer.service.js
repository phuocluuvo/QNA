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
exports.AnswerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const answer_entity_1 = require("./entity/answer.entity");
const create_answer_dto_1 = require("./dto/create-answer.dto");
const class_transformer_1 = require("class-transformer");
const update_answer_dto_1 = require("./dto/update-answer.dto");
const nestjs_paginate_1 = require("nestjs-paginate");
const vote_answer_dto_1 = require("../vote/dto/vote-answer.dto");
const vote_service_1 = require("../vote/vote.service");
const vote_type_enum_1 = require("../enums/vote-type.enum");
const approve_answer_dto_1 = require("./dto/approve-answer.dto");
const message_constants_1 = require("../constants/message.constants");
const answer_pagination_config_1 = require("../config/pagination/answer-pagination.config");
const activity_service_1 = require("../activity/activity.service");
const typeorm_transactional_1 = require("typeorm-transactional");
const reputation_enum_1 = require("../enums/reputation.enum");
const notification_constants_1 = require("../constants/notification.constants");
const notification_service_1 = require("../notification/notification.service");
const history_service_1 = require("../history/history.service");
let AnswerService = class AnswerService {
    constructor(answerRepository, voteService, activityService, notificationService, historyService) {
        this.answerRepository = answerRepository;
        this.voteService = voteService;
        this.activityService = activityService;
        this.notificationService = notificationService;
        this.historyService = historyService;
    }
    async find(questionId, userId, query) {
        const queryBuilder = this.answerRepository.createQueryBuilder("answer");
        queryBuilder.leftJoinAndSelect("answer.question", "question");
        queryBuilder.leftJoinAndSelect("answer.vote", "vote", "vote.user_id = :userId AND vote.answer_id = answer.id", { userId });
        queryBuilder.leftJoinAndSelect("answer.bookmarks", "bookmark", "bookmark.user_id = :userId AND bookmark.answer_id = answer.id", { userId });
        queryBuilder.leftJoinAndSelect("answer.comments", "comment");
        queryBuilder.leftJoinAndSelect("comment.user", "commentUser");
        if (questionId) {
            queryBuilder.where(questionId ? { question: { id: questionId } } : { id: "no_id" });
        }
        return (0, nestjs_paginate_1.paginate)(query, queryBuilder, answer_pagination_config_1.answerPaginateConfig);
    }
    async findOneById(id) {
        const answer = await this.answerRepository.findOne({
            where: { id: id },
            relations: ["user", "question"],
        });
        if (!answer) {
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.ANSWER);
        }
        return answer;
    }
    async findOne(option) {
        const answer = await this.answerRepository.findOne({
            where: option,
            relations: ["user", "question"],
        });
        return answer;
    }
    async create(answerDto, userId) {
        const answerTrans = (0, class_transformer_1.plainToClass)(create_answer_dto_1.CreateAnswerDto, answerDto, {
            excludeExtraneousValues: true,
        });
        answerTrans["user"] = userId;
        answerTrans["question"] = answerDto.question_id;
        return this.answerRepository.save(answerTrans);
    }
    async update(id, answerDto) {
        const answerTrans = (0, class_transformer_1.plainToClass)(update_answer_dto_1.UpdateAnswerDto, answerDto, {
            excludeExtraneousValues: true,
        });
        const answer = await this.answerRepository.preload({
            id,
            ...answerTrans,
        });
        return this.answerRepository.save(answer);
    }
    async remove(answer) {
        return this.answerRepository.softDelete(answer.id);
    }
    async updateVote(userId, answerVoteDto) {
        const answer = await this.findOneById(answerVoteDto.answer_id);
        const createVote = await this.voteService.voteAnswer(userId, answerVoteDto, answer);
        if (answerVoteDto.vote_type === vote_type_enum_1.VoteType.UPVOTE) {
            answer.votes += createVote;
        }
        else if (answerVoteDto.vote_type === vote_type_enum_1.VoteType.DOWNVOTE) {
            answer.votes -= createVote;
        }
        return this.answerRepository.save(answer);
    }
    async approveAnswer(approveAnswerDto) {
        const exitApproved = await this.findOne({
            question: { id: approveAnswerDto.question_id },
            isApproved: true,
        });
        const answerTrans = new update_answer_dto_1.UpdateAnswerDto();
        if (exitApproved && exitApproved.id == approveAnswerDto.answer_id) {
            answerTrans["isApproved"] = false;
            return await this.update(approveAnswerDto.answer_id, answerTrans);
        }
        else if (exitApproved && exitApproved.id != approveAnswerDto.answer_id) {
            answerTrans["isApproved"] = false;
            await this.update(exitApproved.id, answerTrans);
        }
        answerTrans["isApproved"] = true;
        return await this.update(approveAnswerDto.answer_id, answerTrans);
    }
    async createWithActivity(answerDto, userId) {
        const answer = await this.create(answerDto, userId);
        const activity = await this.activityService.create(reputation_enum_1.ReputationActivityTypeEnum.CREATE_ANSWER, reputation_enum_1.ObjectActivityTypeEnum.ANSWER, answer.id, userId, userId);
        await this.notificationService.create(notification_constants_1.notificationText.ANSWER.CREATE, notification_constants_1.notificationTextDesc.ANSWER.CREATE, userId, activity.id);
        return answer;
    }
    async updateWithActivity(id, answerDto, oldAnswer, userId) {
        const answerUpdate = await this.update(id, answerDto);
        const activity = await this.activityService.create(reputation_enum_1.ReputationActivityTypeEnum.UPDATE_ANSWER, reputation_enum_1.ObjectActivityTypeEnum.ANSWER, id, userId, oldAnswer.user.id);
        await this.historyService.createAnswerHistory(oldAnswer, userId);
        if (userId != oldAnswer.user.id) {
            await this.notificationService.create(notification_constants_1.notificationText.ANSWER.UPDATE, notification_constants_1.notificationTextDesc.ANSWER.UPDATE, oldAnswer.user.id, activity.id);
        }
        return answerUpdate;
    }
    async removeWithActivity(answer, userId) {
        const answerId = answer.id;
        await this.remove(answer);
        const activity = await this.activityService.create(reputation_enum_1.ReputationActivityTypeEnum.DELETE_ANSWER, reputation_enum_1.ObjectActivityTypeEnum.ANSWER, answerId, userId, answer.user.id);
        await this.activityService.syncPointDelete(answer.id, answer.user.id);
        await this.notificationService.create(notification_constants_1.notificationText.ANSWER.DELETE, notification_constants_1.notificationTextDesc.ANSWER.DELETE, answer.user.id, activity.id);
        return answer;
    }
    async approveAnswerWithActivity(approveAnswerDto, answer) {
        const answerApprove = await this.approveAnswer(approveAnswerDto);
        const activity = await this.activityService.create(answerApprove.isApproved
            ? reputation_enum_1.ReputationActivityTypeEnum.ACCEPT_ANSWER
            : reputation_enum_1.ReputationActivityTypeEnum.UN_ACCEPT_ANSWER, reputation_enum_1.ObjectActivityTypeEnum.ANSWER, answer.id, answer.user.id, answer.user.id);
        await this.notificationService.create(answerApprove.isApproved
            ? notification_constants_1.notificationText.ANSWER.ACCEPT
            : notification_constants_1.notificationText.ANSWER.UN_APPROVE, answerApprove.isApproved
            ? notification_constants_1.notificationTextDesc.ANSWER.ACCEPT
            : notification_constants_1.notificationTextDesc.ANSWER.UN_APPROVE, answer.user.id, activity.id);
        return answerApprove;
    }
    async getAnswerHistory(query, answerId) {
        return this.historyService.getAnswerHistory(query, answerId);
    }
};
exports.AnswerService = AnswerService;
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, vote_answer_dto_1.VoteAnswerDto]),
    __metadata("design:returntype", Promise)
], AnswerService.prototype, "updateVote", null);
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_answer_dto_1.CreateAnswerDto, String]),
    __metadata("design:returntype", Promise)
], AnswerService.prototype, "createWithActivity", null);
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_answer_dto_1.UpdateAnswerDto,
        answer_entity_1.Answer, String]),
    __metadata("design:returntype", Promise)
], AnswerService.prototype, "updateWithActivity", null);
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [answer_entity_1.Answer, String]),
    __metadata("design:returntype", Promise)
], AnswerService.prototype, "removeWithActivity", null);
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [approve_answer_dto_1.ApproveAnswerDto,
        answer_entity_1.Answer]),
    __metadata("design:returntype", Promise)
], AnswerService.prototype, "approveAnswerWithActivity", null);
exports.AnswerService = AnswerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("ANSWER_REPOSITORY")),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        vote_service_1.VoteService,
        activity_service_1.ActivityService,
        notification_service_1.NotificationService,
        history_service_1.HistoryService])
], AnswerService);
//# sourceMappingURL=answer.service.js.map