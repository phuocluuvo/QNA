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
exports.VoteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const activity_service_1 = require("../activity/activity.service");
const vote_type_enum_1 = require("../enums/vote-type.enum");
const reputation_enum_1 = require("../enums/reputation.enum");
const notification_service_1 = require("../notification/notification.service");
const notification_constants_1 = require("../constants/notification.constants");
const message_constants_1 = require("../constants/message.constants");
let VoteService = class VoteService {
    constructor(voteRepository, activityService, notificationService) {
        this.voteRepository = voteRepository;
        this.activityService = activityService;
        this.notificationService = notificationService;
    }
    async voteQuestion(userId, voteDto, question) {
        if (userId == question.user.id)
            throw new common_1.BadRequestException(message_constants_1.message.VOTE.NOT_VOTE_MY_SELF);
        const vote = await this.handleVote(userId, voteDto, true);
        const activity = await this.activityService.create(this.getReputationType(voteDto, vote), reputation_enum_1.ObjectActivityTypeEnum.VOTE_QUESTION, voteDto.question_id, userId, question.user.id);
        await this.notificationService.create(this.getSateVote(voteDto, vote, true), this.getSateVote(voteDto, vote, false), question.user.id, activity.id);
        return vote;
    }
    async voteAnswer(userId, voteDto, answer) {
        if (userId == answer.user.id)
            throw new common_1.BadRequestException(message_constants_1.message.VOTE.NOT_VOTE_MY_SELF);
        const vote = await this.handleVote(userId, voteDto, false);
        const activity = await this.activityService.create(this.getReputationType(voteDto, vote), reputation_enum_1.ObjectActivityTypeEnum.VOTE_ANSWER, voteDto.answer_id, userId, answer.user.id);
        await this.notificationService.create(this.getSateVote(voteDto, vote, true), this.getSateVote(voteDto, vote, false), answer.user.id, activity.id);
        return vote;
    }
    async handleVote(userId, voteDto, isQuestion) {
        const vote = await this.getVote(isQuestion
            ? { user: { id: userId }, question: { id: voteDto.question_id } }
            : { user: { id: userId }, answer: { id: voteDto.answer_id } });
        if (vote && vote.voteType == voteDto.vote_type) {
            await this.voteRepository.remove(vote);
            return -1;
        }
        if (vote) {
            vote.voteType = voteDto.vote_type;
            await this.saveVote(vote);
            return 2;
        }
        else {
            const voteTrans = this.convertToVote(userId, voteDto, isQuestion);
            const votePre = this.voteRepository.create(voteTrans);
            await this.saveVote(votePre);
            return 1;
        }
    }
    async getVote(query) {
        try {
            return this.voteRepository.findOne({
                where: query,
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async saveVote(vote) {
        try {
            return await this.voteRepository.save(vote);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    convertToVote(userId, voteDto, isQuestion) {
        const trans = {};
        trans["voteType"] = voteDto.vote_type;
        trans["question"] = isQuestion ? voteDto.question_id : null;
        trans["answer"] = !isQuestion ? voteDto.answer_id : null;
        trans["user"] = userId;
        return trans;
    }
    getSateVote(voteDto, state, isTitle) {
        const voteText = isTitle
            ? notification_constants_1.notificationText.VOTE
            : notification_constants_1.notificationTextDesc.VOTE;
        if (voteDto.vote_type == vote_type_enum_1.VoteType.UPVOTE) {
            if (state == 1) {
                return voteText.UP;
            }
            else if (state == -1) {
                return voteText.CANCEL_UP;
            }
            else {
                return voteText.CHANGE_DOWN_TO_UP;
            }
        }
        else if (voteDto.vote_type == vote_type_enum_1.VoteType.DOWNVOTE) {
            if (state == -1) {
                return voteText.CANCEL_DOWN;
            }
            else if (state == 1) {
                return voteText.DOWN;
            }
            else {
                return voteText.CHANGE_UP_TO_DOWN;
            }
        }
    }
    getReputationType(voteDto, state) {
        if (voteDto.vote_type == vote_type_enum_1.VoteType.UPVOTE) {
            if (state == 1) {
                return reputation_enum_1.ReputationActivityTypeEnum.UPVOTE;
            }
            else if (state == -1) {
                return reputation_enum_1.ReputationActivityTypeEnum.CANCLE_UPVOTE;
            }
            else {
                return reputation_enum_1.ReputationActivityTypeEnum.CHANGE_DOWNVOTE_TO_UPVOTE;
            }
        }
        else if (voteDto.vote_type == vote_type_enum_1.VoteType.DOWNVOTE) {
            if (state == -1) {
                return reputation_enum_1.ReputationActivityTypeEnum.CANCLE_DOWNVOTE;
            }
            else if (state == 1) {
                return reputation_enum_1.ReputationActivityTypeEnum.DOWNVOTE;
            }
            else {
                return reputation_enum_1.ReputationActivityTypeEnum.CHANGE_UPVOTE_TO_DOWNVOTE;
            }
        }
    }
    async getVoteInfoByUser(userId) {
        return await this.voteRepository
            .createQueryBuilder("vote")
            .select([
            "COALESCE((SELECT COUNT(*) FROM vote WHERE vote.vote_type = :upvote AND vote.user_id = :userId),0) as upVoteNumber",
            "COALESCE((SELECT COUNT(*) FROM vote WHERE vote.vote_type = :downvote AND vote.user_id = :userId),0) as downVoteNumber",
            "COALESCE((SELECT COUNT(*) FROM vote WHERE vote.question_id IS NOT NULL AND vote.user_id = :userId),0) as voteQuestionNumber",
            "COALESCE((SELECT COUNT(*) FROM vote WHERE vote.answer_id  IS NOT NULL AND vote.user_id = :userId),0) as voteAnswerNumber",
        ])
            .setParameters({
            upvote: "up_vote",
            downvote: "down_vote",
            userId: userId ? userId : "no_id",
        })
            .getRawOne();
    }
};
exports.VoteService = VoteService;
exports.VoteService = VoteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("VOTE_REPOSITORY")),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        activity_service_1.ActivityService,
        notification_service_1.NotificationService])
], VoteService);
//# sourceMappingURL=vote.service.js.map