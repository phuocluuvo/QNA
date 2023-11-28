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
exports.HistoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const history_entity_1 = require("./entity/history.entity");
const reputation_enum_1 = require("../enums/reputation.enum");
const nestjs_paginate_1 = require("nestjs-paginate");
const history_pagination_1 = require("../config/pagination/history-pagination");
let HistoryService = class HistoryService {
    constructor(historyRepository) {
        this.historyRepository = historyRepository;
    }
    async getQuestionHistory(query, questionId) {
        const queryBuilder = this.historyRepository.createQueryBuilder("history");
        queryBuilder.where({ question: { id: questionId } });
        return (0, nestjs_paginate_1.paginate)(query, queryBuilder, history_pagination_1.historyPaginateConfig);
    }
    async getAnswerHistory(query, answerId) {
        const queryBuilder = this.historyRepository.createQueryBuilder("history");
        queryBuilder.where({ answer: { id: answerId } });
        return (0, nestjs_paginate_1.paginate)(query, queryBuilder, history_pagination_1.historyPaginateConfig);
    }
    async getCommentHistory(query, commentId) {
        const queryBuilder = this.historyRepository.createQueryBuilder("history");
        queryBuilder.where({ comment: { id: commentId } });
        return (0, nestjs_paginate_1.paginate)(query, queryBuilder, history_pagination_1.historyPaginateConfig);
    }
    async createQuestionHistory(oldQuestion, userModify) {
        const newHistory = new history_entity_1.History();
        newHistory.question = { id: oldQuestion.id };
        newHistory.type = reputation_enum_1.ObjectActivityTypeEnum.QUESTION;
        newHistory.title = oldQuestion.title;
        newHistory.content = oldQuestion.content;
        newHistory.user = { id: userModify };
        return this.historyRepository.save(newHistory);
    }
    async createAnswerHistory(oldAnswer, userModify) {
        const newHistory = new history_entity_1.History();
        newHistory.answer = { id: oldAnswer.id };
        newHistory.type = reputation_enum_1.ObjectActivityTypeEnum.ANSWER;
        newHistory.content = oldAnswer.content;
        newHistory.user = { id: userModify };
        return this.historyRepository.save(newHistory);
    }
    async createCommentHistory(oldComment, userModify) {
        const newHistory = new history_entity_1.History();
        newHistory.comment = { id: oldComment.id };
        newHistory.type = reputation_enum_1.ObjectActivityTypeEnum.COMMENT;
        newHistory.content = oldComment.content;
        newHistory.user = { id: userModify };
        return this.historyRepository.save(newHistory);
    }
};
exports.HistoryService = HistoryService;
exports.HistoryService = HistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("HISTORY_REPOSITORY")),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], HistoryService);
//# sourceMappingURL=history.service.js.map