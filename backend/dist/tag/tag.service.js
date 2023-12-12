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
exports.TagService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const message_constants_1 = require("../constants/message.constants");
const create_tag_dto_1 = require("./dto/create-tag.dto");
const class_transformer_1 = require("class-transformer");
const update_tag_dto_1 = require("./dto/update-tag.dto");
const nestjs_paginate_1 = require("nestjs-paginate");
const tag_pagination_config_1 = require("../config/pagination/tag-pagination.config");
const tag_state_enum_1 = require("../enums/tag-state.enum");
const reputation_enum_1 = require("../enums/reputation.enum");
const activity_service_1 = require("../activity/activity.service");
const notification_constants_1 = require("../constants/notification.constants");
const notification_service_1 = require("../notification/notification.service");
const typeorm_transactional_1 = require("typeorm-transactional");
let TagService = class TagService {
    constructor(tagRepository, activityService, notificationService) {
        this.tagRepository = tagRepository;
        this.activityService = activityService;
        this.notificationService = notificationService;
    }
    async find(query, user) {
        const queryBuilder = this.tagRepository.createQueryBuilder("tag");
        return await (0, nestjs_paginate_1.paginate)(query, queryBuilder, tag_pagination_config_1.tagPaginateConfig);
    }
    async findOneByName(name) {
        const comment = await this.tagRepository.findOne({
            where: { name: name },
            relations: ["user"],
        });
        if (!comment) {
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.TAG);
        }
        return comment;
    }
    async findOne(option) {
        return await this.tagRepository.findOne({
            where: option,
        });
    }
    async create(tagDto, userId) {
        const tagTrans = (0, class_transformer_1.plainToClass)(create_tag_dto_1.CreateTagDto, tagDto, {
            excludeExtraneousValues: true,
        });
        tagTrans["user"] = userId;
        return this.tagRepository.save(tagTrans);
    }
    async update(id, tagDto) {
        const tagTrans = (0, class_transformer_1.plainToClass)(update_tag_dto_1.UpdateTagDto, tagDto, {
            excludeExtraneousValues: true,
        });
        const tag = await this.tagRepository.preload({
            id,
            ...tagTrans,
        });
        return this.tagRepository.save(tag);
    }
    async remove(tag) {
        return this.tagRepository.remove(tag);
    }
    async checkAndTransTags(tag_ids) {
        const tagPromises = tag_ids.map(async (id) => {
            const tagExists = await this.tagRepository.findOne({ where: { id: id } });
            if (!tagExists) {
                throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.TAG + ": " + id);
            }
            else {
                return tagExists;
            }
        });
        return await Promise.all(tagPromises);
    }
    async censoring(tagId, userId, state) {
        const tag = await this.tagRepository.findOne({
            where: { id: tagId },
            relations: ["user"],
        });
        if (!tag) {
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.TAG);
        }
        if (tag.state == state) {
            throw new common_1.BadRequestException(message_constants_1.message.TAG.VERIFIED);
        }
        tag.state = state;
        const result = await this.tagRepository.save(tag);
        const activity = await this.activityService.create(reputation_enum_1.ReputationActivityTypeEnum.VERIFY_TAG, reputation_enum_1.ObjectActivityTypeEnum.TAG, tagId, userId, tag.user.id);
        await this.notificationService.create(notification_constants_1.notificationText.TAG.VERIFY, notification_constants_1.notificationTextDesc.TAG.VERIFY, tag.user.id, activity.id);
        return result;
    }
    getTop5HasMostQuestion() {
        const queryBuilder = this.tagRepository
            .createQueryBuilder("tag")
            .select([
            "tag.id as id",
            "tag.name as name",
            "tag.content as content",
            "tag.state as state",
            "tag.created_at as created_at",
            "tag.updated_at as updated_at",
        ])
            .addSelect("COUNT(tag.id)", "question_count")
            .leftJoin("question_tag", "question_tag", "question_tag.tag_id = tag.id")
            .groupBy("tag.id")
            .orderBy("question_count", "DESC")
            .limit(5);
        return queryBuilder.getRawMany();
    }
    async topTagUserByUser(userId) {
        const queryBuilder = this.tagRepository
            .createQueryBuilder("tag")
            .addSelect(["COUNT(tag.id) as tag_questionsNumber"])
            .leftJoin("tag.questions", "question")
            .leftJoin("question.user", "user")
            .where("user.id = :userId", { userId: userId })
            .groupBy("tag.id")
            .limit(10);
        return queryBuilder.getMany();
    }
};
exports.TagService = TagService;
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TagService.prototype, "censoring", null);
exports.TagService = TagService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("TAG_REPOSITORY")),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        activity_service_1.ActivityService,
        notification_service_1.NotificationService])
], TagService);
//# sourceMappingURL=tag.service.js.map