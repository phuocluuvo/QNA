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
exports.QuestionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const question_entity_1 = require("./entity/question.entity");
const create_question_dto_1 = require("./dto/create-question.dto");
const nestjs_paginate_1 = require("nestjs-paginate");
const update_question_dto_1 = require("./dto/update-question.dto");
const class_transformer_1 = require("class-transformer");
const vote_type_enum_1 = require("../enums/vote-type.enum");
const vote_service_1 = require("../vote/vote.service");
const vote_question_dto_1 = require("../vote/dto/vote-question.dto");
const message_constants_1 = require("../constants/message.constants");
const tag_service_1 = require("../tag/tag.service");
const question_pagination_config_1 = require("../config/pagination/question-pagination.config");
const activity_service_1 = require("../activity/activity.service");
const reputation_enum_1 = require("../enums/reputation.enum");
const typeorm_transactional_1 = require("typeorm-transactional");
const notification_service_1 = require("../notification/notification.service");
const notification_constants_1 = require("../constants/notification.constants");
const role_enum_1 = require("../enums/role.enum");
const question_state_enum_1 = require("../enums/question-state.enum");
const question_type_enum_1 = require("../enums/question-type.enum");
const users_service_1 = require("../users/users.service");
const history_service_1 = require("../history/history.service");
const bookmark_service_1 = require("../bookmark/bookmark.service");
const cache_manager_1 = require("@nestjs/cache-manager");
let QuestionService = class QuestionService {
    constructor(questionRepository, voteService, tagService, activityService, notificationService, userService, historyService, bookmarkService, cacheManager) {
        this.questionRepository = questionRepository;
        this.voteService = voteService;
        this.tagService = tagService;
        this.activityService = activityService;
        this.notificationService = notificationService;
        this.userService = userService;
        this.historyService = historyService;
        this.bookmarkService = bookmarkService;
        this.cacheManager = cacheManager;
    }
    async find(query, tagNames, loginUser) {
        const tags = tagNames ? tagNames.split(",") : [];
        const queryBuilder = this.questionRepository.createQueryBuilder("question");
        const subQuery = `
    COALESCE(
        (SELECT JSON_ARRAYAGG(t.name)
         FROM tag AS t
         JOIN question_tag AS qt ON t.id = qt.tag_id
         WHERE qt.question_id = question.id),
        JSON_ARRAY()
      )
      `;
        queryBuilder.where(`JSON_CONTAINS( ${subQuery}, :tags)`, {
            tags: JSON.stringify(tags),
        });
        if (loginUser == null || loginUser.role == role_enum_1.Role.USER) {
            queryBuilder.andWhere("question.state <> :state", {
                state: question_state_enum_1.QuestionState.BLOCKED,
            });
        }
        return await (0, nestjs_paginate_1.paginate)(query, queryBuilder, question_pagination_config_1.questionPaginateConfig);
    }
    async findOneById(id) {
        const question = await this.questionRepository.findOne({
            where: { id: id },
            relations: ["user"],
        });
        if (!question) {
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.QUESTION);
        }
        return question;
    }
    async create(questionDto, userId) {
        const questionTrans = (0, class_transformer_1.plainToClass)(create_question_dto_1.CreateQuestionDto, questionDto, {
            excludeExtraneousValues: true,
        });
        questionTrans["user"] = userId;
        questionTrans["tags"] = await this.tagService.checkAndTransTags(questionDto.tag_ids ? questionDto.tag_ids : []);
        return this.questionRepository.save(questionTrans);
    }
    async update(id, questionDto) {
        const questionTrans = (0, class_transformer_1.plainToClass)(update_question_dto_1.UpdateQuestionDto, questionDto, {
            excludeExtraneousValues: true,
        });
        if (questionDto.tag_ids) {
            questionTrans["tags"] = await this.tagService.checkAndTransTags(questionDto.tag_ids ? questionDto.tag_ids : []);
        }
        const question = await this.questionRepository.preload({
            id: id,
            ...questionTrans,
        });
        delete question.tagNames;
        question.updatedAt = new Date();
        return this.questionRepository.save(question);
    }
    async remove(question) {
        return this.questionRepository.softDelete(question.id);
    }
    async getQuestionAndIncreaseViewCount(questionId, userId, ip) {
        try {
            const question = await this.questionRepository.findOne({
                where: { id: questionId },
                relations: ["user", "tags", "comments", "comments.user"],
            });
            if (!question) {
                throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.QUESTION);
            }
            return await this.increaseViewCount(question, userId, ip);
        }
        catch (error) {
            const question = await this.questionRepository.findOne({
                where: { id: questionId },
                relations: ["user"],
            });
            if (!question) {
                throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.QUESTION);
            }
            return await this.increaseViewCount(question, userId, ip);
        }
    }
    async updateVote(userId, questionVoteDto) {
        const question = await this.findOneById(questionVoteDto.question_id);
        const createVote = await this.voteService.voteQuestion(userId, questionVoteDto, question);
        if (questionVoteDto.vote_type === vote_type_enum_1.VoteType.UPVOTE) {
            question.votes += createVote;
        }
        else if (questionVoteDto.vote_type === vote_type_enum_1.VoteType.DOWNVOTE) {
            question.votes -= createVote;
        }
        try {
            return this.questionRepository.save(question);
        }
        catch (error) {
            throw new Error("Error updating vote");
        }
    }
    async increaseViewCount(question, userId, ip) {
        const key = ip + question.id;
        const cache = await this.cacheManager.get(key);
        const result = question;
        if (!cache) {
            question.views += 1;
            await this.questionRepository.save(question);
            await this.cacheManager.set(key, "view", { ttl: 40 });
        }
        result.vote = [];
        if (userId) {
            const voteInfo = await this.voteService.getVote({
                user: { id: userId },
                question: { id: question.id },
            });
            if (voteInfo) {
                result.vote.push(voteInfo);
            }
            const bookmark = await this.bookmarkService.checkQuestionIsBookmark(question.id, userId);
            if (bookmark) {
                result["bookmarks"] = [bookmark];
            }
        }
        return result;
    }
    async createWithActivity(questionDto, userId) {
        if (await this.activityService.checkCreateQuestion(userId)) {
            const question = await this.create(questionDto, userId);
            const activity = await this.activityService.create(reputation_enum_1.ReputationActivityTypeEnum.CREATE_QUESTION, reputation_enum_1.ObjectActivityTypeEnum.QUESTION, question.id, userId, userId);
            await this.notificationService.create(notification_constants_1.notificationText.QUESTION.CREATE, notification_constants_1.notificationTextDesc.QUESTION.CREATE, userId, activity.id);
            return question;
        }
        else {
            throw new common_1.BadRequestException(message_constants_1.message.REPUTATION.NOT_ENOUGH);
        }
    }
    async updateWithActivity(id, questionDto, oldQuestion, userId) {
        const questionUpdate = await this.update(id, questionDto);
        const activity = await this.activityService.create(reputation_enum_1.ReputationActivityTypeEnum.UPDATE_QUESTION, reputation_enum_1.ObjectActivityTypeEnum.QUESTION, id, userId, oldQuestion.user.id);
        await this.historyService.createQuestionHistory(oldQuestion, userId);
        if (userId != oldQuestion.user.id) {
            await this.notificationService.create(notification_constants_1.notificationText.QUESTION.UPDATE, notification_constants_1.notificationTextDesc.QUESTION.UPDATE, oldQuestion.user.id, activity.id);
        }
        return questionUpdate;
    }
    async removeWithActivity(question, userId) {
        const questionId = question.id;
        await this.remove(question);
        const activity = await this.activityService.create(reputation_enum_1.ReputationActivityTypeEnum.DELETE_QUESTION, reputation_enum_1.ObjectActivityTypeEnum.QUESTION, questionId, userId, question.user.id);
        await this.activityService.syncPointDelete(question.id, question.user.id);
        await this.notificationService.create(notification_constants_1.notificationText.QUESTION.DELETE, notification_constants_1.notificationTextDesc.QUESTION.DELETE, question.user.id, activity.id);
        return question;
    }
    async related(query, tagNames) {
        const tags = tagNames ? tagNames.split(",") : [];
        const queryBuilder = this.questionRepository.createQueryBuilder("question");
        queryBuilder.leftJoinAndSelect("question.tags", "tag");
        tags.forEach((tag, index) => {
            queryBuilder.orWhere("tag.name = :tag" + index, { ["tag" + index]: tag });
        });
        return await (0, nestjs_paginate_1.paginate)(query, queryBuilder, question_pagination_config_1.questionPaginateConfig);
    }
    async censoring(questionId, userId, state) {
        let mess, repu, noti, notiDesc;
        if (state == question_state_enum_1.QuestionState.VERIFIED) {
            mess = message_constants_1.message.QUESTION.VERIFIED;
            repu = reputation_enum_1.ReputationActivityTypeEnum.VERIFY_QUESTION;
            noti = notification_constants_1.notificationText.QUESTION.VERIFY;
            notiDesc = notification_constants_1.notificationTextDesc.QUESTION.VERIFY;
        }
        else if (state == question_state_enum_1.QuestionState.BLOCKED) {
            mess = message_constants_1.message.QUESTION.BLOCKED;
            repu = reputation_enum_1.ReputationActivityTypeEnum.BLOCK_QUESTION;
            noti = notification_constants_1.notificationText.QUESTION.BLOCK;
            notiDesc = notification_constants_1.notificationTextDesc.QUESTION.BLOCK;
        }
        else if (state == question_state_enum_1.QuestionState.PENDING) {
            mess = message_constants_1.message.QUESTION.PENDING;
            repu = reputation_enum_1.ReputationActivityTypeEnum.UN_BLOCK_QUESTION;
            noti = notification_constants_1.notificationText.QUESTION.VERIFY;
            notiDesc = notification_constants_1.notificationTextDesc.QUESTION.UN_BLOCK;
        }
        const question = await this.findOneById(questionId);
        if (question.state == state) {
            throw new common_1.BadRequestException(mess);
        }
        question.state = state;
        const result = await this.questionRepository.save(question);
        const activity = await this.activityService.create(repu, reputation_enum_1.ObjectActivityTypeEnum.QUESTION, questionId, userId, question.user.id);
        await this.notificationService.create(noti, notiDesc, question.user.id, activity.id);
        return result;
    }
    async getCountQuestionByTime(timeType) {
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentQuarter = Math.ceil(currentMonth / 3);
        const queryBuilder = this.questionRepository.createQueryBuilder("question");
        switch (timeType) {
            case question_type_enum_1.QuestionTimeTypeEnum.DAY:
                queryBuilder
                    .where("YEAR(question.createdAt) = :year", { year: currentYear })
                    .andWhere("MONTH(question.createdAt) = :month", {
                    month: currentMonth,
                })
                    .andWhere("DAY(question.createdAt) = :day", {
                    day: currentDay,
                });
                break;
            case question_type_enum_1.QuestionTimeTypeEnum.MONTH:
                queryBuilder
                    .where("YEAR(question.createdAt) = :year", { year: currentYear })
                    .andWhere("MONTH(question.createdAt) = :month", {
                    month: currentMonth,
                });
                break;
            case question_type_enum_1.QuestionTimeTypeEnum.QUARTER:
                queryBuilder
                    .where("YEAR(question.createdAt) = :year", { year: currentYear })
                    .andWhere("QUARTER(question.createdAt) = :quarter", {
                    quarter: currentQuarter,
                });
                break;
            case question_type_enum_1.QuestionTimeTypeEnum.YEAR:
                queryBuilder.where("YEAR(question.createdAt) = :year", {
                    year: currentYear,
                });
                break;
            default:
                break;
        }
        return await queryBuilder.getCount();
    }
    async getCountQuestion() {
        return {
            data: {
                all: await this.questionRepository.count(),
                currentDay: await this.getCountQuestionByTime(question_type_enum_1.QuestionTimeTypeEnum.DAY),
                currentMonth: await this.getCountQuestionByTime(question_type_enum_1.QuestionTimeTypeEnum.MONTH),
                currentQuarter: await this.getCountQuestionByTime(question_type_enum_1.QuestionTimeTypeEnum.QUARTER),
                currentYear: await this.getCountQuestionByTime(question_type_enum_1.QuestionTimeTypeEnum.YEAR),
            },
        };
    }
    getTop5ByViews() {
        const queryBuilder = this.questionRepository
            .createQueryBuilder("question")
            .orderBy(`question.views`, "DESC")
            .limit(5);
        return queryBuilder.getMany();
    }
    getTop5ByVotes() {
        const queryBuilder = this.questionRepository
            .createQueryBuilder("question")
            .orderBy(`question.votes`, "DESC")
            .limit(5);
        return queryBuilder.getMany();
    }
    getTop5ByAnswers() {
        const queryBuilder = this.questionRepository
            .createQueryBuilder("question")
            .addSelect("COUNT(answer.id)", "answer_count")
            .leftJoin("question.answers", "answer")
            .groupBy("question.id")
            .orderBy("answer_count", "DESC")
            .limit(5);
        return queryBuilder.getMany();
    }
    async getQuestionHistory(query, questionId) {
        return this.historyService.getQuestionHistory(query, questionId);
    }
    async replaceTag(newTagId, oldTagId) {
        const tagToReplace = await this.tagService.findOne({ id: newTagId });
        if (!tagToReplace) {
            throw new common_1.NotFoundException(`Tag with ID ${newTagId} not found.`);
        }
        const oldTag = await this.tagService.findOne({ id: oldTagId });
        if (!oldTag) {
            throw new common_1.NotFoundException(`New tag with ID ${oldTagId} not found.`);
        }
        try {
            const questions = await this.questionRepository.query(`SELECT * FROM question_tag WHERE tag_id = '${oldTagId}'`);
            for (const question of questions) {
                const check = await this.questionRepository.query(`SELECT count(*) as numberQuestion FROM question_tag WHERE question_id = '${question.question_id}' AND tag_id = '${newTagId}'`);
                if (check[0].numberQuestion == 0) {
                    await this.questionRepository.query(`UPDATE question_tag SET tag_id = '${newTagId}' WHERE question_id = '${question.question_id}' AND tag_id = '${oldTagId}'`);
                }
                else {
                    await this.questionRepository.query(`DELETE FROM question_tag WHERE question_id = '${question.question_id}' AND tag_id = '${newTagId}'`);
                }
            }
            await this.tagService.remove(oldTag);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error replace tag`);
        }
        return tagToReplace;
    }
    async checkReport(questionId) {
        return await this.activityService.checkUndeleteQuestion(questionId);
    }
    async getCountReport(questionId) {
        return await this.activityService.countUnblockQuestion(questionId);
    }
};
exports.QuestionService = QuestionService;
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, vote_question_dto_1.VoteQuestionDto]),
    __metadata("design:returntype", Promise)
], QuestionService.prototype, "updateVote", null);
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [question_entity_1.Question, String, String]),
    __metadata("design:returntype", Promise)
], QuestionService.prototype, "increaseViewCount", null);
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_question_dto_1.CreateQuestionDto, String]),
    __metadata("design:returntype", Promise)
], QuestionService.prototype, "createWithActivity", null);
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_question_dto_1.UpdateQuestionDto,
        question_entity_1.Question, String]),
    __metadata("design:returntype", Promise)
], QuestionService.prototype, "updateWithActivity", null);
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [question_entity_1.Question, String]),
    __metadata("design:returntype", Promise)
], QuestionService.prototype, "removeWithActivity", null);
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], QuestionService.prototype, "censoring", null);
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QuestionService.prototype, "replaceTag", null);
exports.QuestionService = QuestionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("QUESTION_REPOSITORY")),
    __param(7, (0, common_1.Inject)((0, common_1.forwardRef)(() => bookmark_service_1.BookmarkService))),
    __param(8, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        vote_service_1.VoteService,
        tag_service_1.TagService,
        activity_service_1.ActivityService,
        notification_service_1.NotificationService,
        users_service_1.UsersService,
        history_service_1.HistoryService,
        bookmark_service_1.BookmarkService, Object])
], QuestionService);
//# sourceMappingURL=question.service.js.map