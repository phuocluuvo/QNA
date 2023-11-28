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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const notification_entity_1 = require("./entity/notification.entity");
const notification_dto_1 = require("./dto/notification.dto");
const class_transformer_1 = require("class-transformer");
const message_constants_1 = require("../constants/message.constants");
const nestjs_paginate_1 = require("nestjs-paginate");
const notification_pagination_1 = require("../config/pagination/notification-pagination");
let NotificationService = class NotificationService {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async findByUserId(query, filter, userId) {
        const queryBuidler = this.notificationRepository.createQueryBuilder("notification");
        queryBuidler.where({ user: { id: userId } });
        if (filter) {
            const isRead = filter === "true";
            queryBuidler.andWhere("notification.isRead = :isRead", {
                isRead: isRead,
            });
        }
        return (0, nestjs_paginate_1.paginate)(query, queryBuidler, notification_pagination_1.notificationPagination);
    }
    async findAnnouncement() {
        return this.notificationRepository.find({
            where: { isAnnouncement: true },
            relations: ["user"],
        });
    }
    async getBadgeNumber(userId) {
        return this.notificationRepository.count({
            where: { isRead: false, user: { id: userId } },
        });
    }
    async findOneByIdUser(id, userId) {
        return this.notificationRepository.findOne({
            where: { id, user: { id: userId } },
        });
    }
    async create(title, description, userId, activityId) {
        const notification = new notification_entity_1.Notification();
        notification.title = title;
        notification.description = description;
        notification.user = { id: userId };
        notification.activity = { id: activityId };
        return this.notificationRepository.save(notification);
    }
    async update(id, title, description) {
        const notification = await this.notificationRepository.preload({
            id,
            title,
            description,
        });
        return this.notificationRepository.save(notification);
    }
    async delete(notification) {
        return this.notificationRepository.remove(notification);
    }
    async createAnnouncement(notificationDto) {
        const notificationTrans = (0, class_transformer_1.plainToClass)(notification_dto_1.NotificationDto, notificationDto, {
            excludeExtraneousValues: true,
        });
        notificationTrans["isAnnouncement"] = true;
        return this.notificationRepository.save(notificationTrans);
    }
    async updateAnnouncement(id, notificationDto) {
        const notificationTrans = (0, class_transformer_1.plainToClass)(notification_dto_1.NotificationDto, notificationDto, {
            excludeExtraneousValues: true,
        });
        const notification = await this.notificationRepository.preload({
            id,
            ...notificationTrans,
        });
        if (!notification)
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.NOTIFICATION);
        return this.notificationRepository.save(notification);
    }
    async deleteAnnouncement(id) {
        const announcement = await this.notificationRepository.findOneById(id);
        if (!announcement)
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.NOTIFICATION);
        return this.notificationRepository.remove(announcement);
    }
    async readNotification(id) {
        const notification = await this.notificationRepository.preload({
            id,
            isRead: true,
        });
        return this.notificationRepository.save(notification);
    }
    async readAllNotification(userId) {
        const result = this.notificationRepository
            .createQueryBuilder("nocification")
            .update(notification_entity_1.Notification)
            .set({ isRead: true })
            .where({ user: { id: userId } })
            .execute();
        if (result) {
            return true;
        }
        else {
            return false;
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("NOTIFICATION_REPOSITORY")),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], NotificationService);
//# sourceMappingURL=notification.service.js.map