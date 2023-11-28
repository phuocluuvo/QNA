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
exports.BookmarkService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const nestjs_paginate_1 = require("nestjs-paginate");
const bookmark_pagination_1 = require("../config/pagination/bookmark-pagination");
const message_constants_1 = require("../constants/message.constants");
const reputation_enum_1 = require("../enums/reputation.enum");
let BookmarkService = class BookmarkService {
    constructor(bookmarkRepository) {
        this.bookmarkRepository = bookmarkRepository;
    }
    async find(query, userId) {
        const queryBuilder = this.bookmarkRepository.createQueryBuilder("bookmark");
        queryBuilder.leftJoinAndSelect("bookmark.user", "user");
        queryBuilder.where({ user: { id: userId } });
        return (0, nestjs_paginate_1.paginate)(query, queryBuilder, bookmark_pagination_1.bookmarkPaginateConfig);
    }
    async getBookmarkCollection(query, userId, collectionId) {
        const queryBuilder = this.bookmarkRepository.createQueryBuilder("bookmark");
        queryBuilder.leftJoinAndSelect("bookmark.user", "user");
        queryBuilder.leftJoinAndSelect("bookmark.collection", "collection");
        queryBuilder.where({ user: { id: userId } });
        queryBuilder.andWhere({ collection: { id: collectionId } });
        return (0, nestjs_paginate_1.paginate)(query, queryBuilder, bookmark_pagination_1.bookmarkPaginateConfig);
    }
    async getBookmarkCollectionForLater(query, userId) {
        const queryBuilder = this.bookmarkRepository.createQueryBuilder("bookmark");
        queryBuilder.leftJoinAndSelect("bookmark.user", "user");
        queryBuilder.leftJoinAndSelect("bookmark.collection", "collection");
        queryBuilder.where({ user: { id: userId } });
        queryBuilder.andWhere("bookmark.collection.id IS NULL");
        return (0, nestjs_paginate_1.paginate)(query, queryBuilder, bookmark_pagination_1.bookmarkPaginateConfig);
    }
    async create(createBookmarkDto, userId) {
        const bookmarkTrans = {};
        bookmarkTrans["user"] = userId;
        if (createBookmarkDto.question_id) {
            bookmarkTrans["question"] = createBookmarkDto.question_id;
            bookmarkTrans["type"] = reputation_enum_1.ObjectActivityTypeEnum.QUESTION;
        }
        else {
            bookmarkTrans["answer"] = createBookmarkDto.answer_id;
            bookmarkTrans["type"] = reputation_enum_1.ObjectActivityTypeEnum.ANSWER;
        }
        const bookmark = this.bookmarkRepository.create(bookmarkTrans);
        return this.bookmarkRepository.save(bookmark);
    }
    async update(bookmark, collection) {
        if (collection != null) {
            bookmark.collection = collection;
        }
        else {
            bookmark.collection = null;
        }
        return this.bookmarkRepository.save(bookmark);
    }
    async remove(bookmark) {
        return this.bookmarkRepository.remove(bookmark);
    }
    async findOneById(id) {
        const bookmark = await this.bookmarkRepository.findOne({
            where: { id: id },
            relations: ["user", "answer", "question"],
        });
        if (!bookmark) {
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.BOOKMARK);
        }
        return bookmark;
    }
    async findOne(id) {
        return await this.bookmarkRepository.findOne({
            where: { id: id },
        });
    }
    async checkQuestionIsBookmark(questionId, userId) {
        return await this.bookmarkRepository.findOne({
            where: { question: { id: questionId }, user: { id: userId } },
        });
    }
    async checkAnswerIsBookmark(questionId, userId) {
        return await this.bookmarkRepository.findOne({
            where: { answer: { id: questionId }, user: { id: userId } },
        });
    }
};
exports.BookmarkService = BookmarkService;
exports.BookmarkService = BookmarkService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("BOOKMARK_REPOSITORY")),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], BookmarkService);
//# sourceMappingURL=bookmark.service.js.map