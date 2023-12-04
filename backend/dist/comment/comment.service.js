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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const comment_entity_1 = require("./entity/comment.entity");
const nestjs_paginate_1 = require("nestjs-paginate");
const class_transformer_1 = require("class-transformer");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const update_answer_dto_1 = require("../answer/dto/update-answer.dto");
const message_constants_1 = require("../constants/message.constants");
const comment_pagination_1 = require("../config/pagination/comment-pagination");
const typeorm_transactional_1 = require("typeorm-transactional");
const activity_service_1 = require("../activity/activity.service");
const reputation_enum_1 = require("../enums/reputation.enum");
const notification_constants_1 = require("../constants/notification.constants");
const notification_service_1 = require("../notification/notification.service");
const history_service_1 = require("../history/history.service");
let CommentService = class CommentService {
    constructor(commentRepository, activityService, notificationService, historyService) {
        this.commentRepository = commentRepository;
        this.activityService = activityService;
        this.notificationService = notificationService;
        this.historyService = historyService;
    }
    async find(answerId, query) {
        const queryBuilder = this.commentRepository.createQueryBuilder("comment");
        queryBuilder.innerJoinAndSelect("comment.user", "user");
        queryBuilder.where(answerId ? { answer: { id: answerId } } : { id: "no_id" });
        return (0, nestjs_paginate_1.paginate)(query, queryBuilder, comment_pagination_1.commentPaginateConfig);
    }
    async findOneById(id) {
        const comment = await this.commentRepository.findOne({
            where: { id: id },
            relations: ["user", "answer"],
        });
        if (!comment) {
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.COMMENT);
        }
        return comment;
    }
    async findOne(option) {
        return await this.commentRepository.findOne({
            where: option,
            relations: ["user", "answer"],
        });
    }
    async create(commentDto, userId) {
        const commentTrans = (0, class_transformer_1.plainToClass)(create_comment_dto_1.CreateCommentDto, commentDto, {
            excludeExtraneousValues: true,
        });
        commentTrans["user"] = userId;
        if (commentDto.answer_id) {
            commentTrans["answer"] = commentDto.answer_id;
        }
        else {
            commentTrans["question"] = commentDto.question_id;
        }
        if (commentDto.type) {
            commentTrans["type"] = commentDto.type;
        }
        return this.commentRepository.save(commentTrans);
    }
    async update(id, commentDto) {
        const commentTrans = (0, class_transformer_1.plainToClass)(update_answer_dto_1.UpdateAnswerDto, commentDto, {
            excludeExtraneousValues: true,
        });
        const comment = await this.commentRepository.preload({
            id,
            ...commentTrans,
        });
        return this.commentRepository.save(comment);
    }
    async remove(comment) {
        return this.commentRepository.softDelete(comment.id);
    }
    async createWithActivity(commentDto, userId) {
        const comment = await this.create(commentDto, userId);
        const activity = await this.activityService.create(reputation_enum_1.ReputationActivityTypeEnum.CREATE_COMMENT, reputation_enum_1.ObjectActivityTypeEnum.COMMENT, comment.id, userId, userId);
        await this.notificationService.create(notification_constants_1.notificationText.COMMENT.CREATE, notification_constants_1.notificationTextDesc.COMMENT.CREATE, userId, activity.id);
        return comment;
    }
    async updateWithActivity(id, commentDto, oldComment, userId) {
        const comment = await this.update(id, commentDto);
        const activity = await this.activityService.create(reputation_enum_1.ReputationActivityTypeEnum.UPDATE_COMMENT, reputation_enum_1.ObjectActivityTypeEnum.COMMENT, comment.id, userId, oldComment.user.id);
        await this.historyService.createCommentHistory(oldComment, userId);
        if (userId != oldComment.user.id) {
            await this.notificationService.create(notification_constants_1.notificationText.COMMENT.UPDATE, notification_constants_1.notificationTextDesc.COMMENT.UPDATE, oldComment.user.id, activity.id);
        }
        return comment;
    }
    async removeWithActivity(comment, userId) {
        const activity = await this.activityService.create(reputation_enum_1.ReputationActivityTypeEnum.DELETE_COMMENT, reputation_enum_1.ObjectActivityTypeEnum.COMMENT, comment.id, userId, comment.user.id);
        await this.notificationService.create(notification_constants_1.notificationText.COMMENT.DELETE, notification_constants_1.notificationTextDesc.COMMENT.DELETE, comment.user.id, activity.id);
        await this.remove(comment);
        return comment;
    }
    async getCommentHistory(query, commentId) {
        return this.historyService.getAnswerHistory(query, commentId);
    }
};
exports.CommentService = CommentService;
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_comment_dto_1.CreateCommentDto, String]),
    __metadata("design:returntype", Promise)
], CommentService.prototype, "createWithActivity", null);
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_entity_1.Comment, String]),
    __metadata("design:returntype", Promise)
], CommentService.prototype, "removeWithActivity", null);
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("COMMENT_REPOSITORY")),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        activity_service_1.ActivityService,
        notification_service_1.NotificationService,
        history_service_1.HistoryService])
], CommentService);
//# sourceMappingURL=comment.service.js.map