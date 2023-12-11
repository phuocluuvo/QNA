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
exports.AnnouncementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const message_constants_1 = require("../constants/message.constants");
const announcement_entity_1 = require("./entity/announcement.entity");
const update_announcement_dto_1 = require("./dto/update-announcement.dto");
const nestjs_paginate_1 = require("nestjs-paginate");
const announcement_pagination_1 = require("../config/pagination/announcement-pagination");
let AnnouncementService = class AnnouncementService {
    constructor(announcementRepository) {
        this.announcementRepository = announcementRepository;
    }
    async create(announcementDto) {
        const announcement = (0, class_transformer_1.plainToClass)(announcement_entity_1.Announcement, announcementDto);
        return this.announcementRepository.save(announcement);
    }
    async update(id, announcementDto) {
        const announcementTrans = (0, class_transformer_1.plainToClass)(update_announcement_dto_1.UpdateAnnouncementDto, announcementDto, {
            excludeExtraneousValues: true,
        });
        const announcement = await this.announcementRepository.preload({
            id,
            ...announcementTrans,
        });
        if (!announcement)
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.ANNOUCEMENT);
        return this.announcementRepository.save(announcement);
    }
    async delete(id) {
        const announcement = await this.announcementRepository.findOneById(id);
        if (!announcement)
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.ANNOUCEMENT);
        return this.announcementRepository.remove(announcement);
    }
    async getAll(query, findAnnouncementDto) {
        const queryBuidler = this.announcementRepository.createQueryBuilder("announcement");
        if (findAnnouncementDto.is_published)
            queryBuidler.andWhere("announcement.is_published = :is_published", {
                is_published: findAnnouncementDto.is_published,
            });
        if (findAnnouncementDto.title)
            queryBuidler.andWhere("announcement.title LIKE :title", {
                title: `%${findAnnouncementDto.title}%`,
            });
        return (0, nestjs_paginate_1.paginate)(query, queryBuidler, announcement_pagination_1.announcementPaginateConfig);
    }
    async getAllForUser(query, findAnnouncementDto) {
        const queryBuilder = this.announcementRepository
            .createQueryBuilder("announcement")
            .where("announcement.expiration_date > :currentTime", {
            currentTime: new Date(),
        })
            .andWhere("announcement.publication_date < :currentTime", {
            currentTime: new Date(),
        });
        if (findAnnouncementDto.is_published)
            queryBuilder.andWhere("announcement.is_published = :is_published", {
                is_published: findAnnouncementDto.is_published,
            });
        if (findAnnouncementDto.title)
            queryBuilder.andWhere("announcement.title LIKE :title", {
                title: `%${findAnnouncementDto.title}%`,
            });
        return (0, nestjs_paginate_1.paginate)(query, queryBuilder, announcement_pagination_1.announcementPaginateConfig);
    }
    async getOne(id) {
        const announcement = await this.announcementRepository.findOneById(id);
        if (!announcement)
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.ANNOUCEMENT);
        return announcement;
    }
};
exports.AnnouncementService = AnnouncementService;
exports.AnnouncementService = AnnouncementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("ANNOUNCEMENT_REPOSITORY")),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], AnnouncementService);
//# sourceMappingURL=announcement.service.js.map