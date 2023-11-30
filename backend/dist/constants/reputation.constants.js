"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reputationActivityPoint = void 0;
const reputation_enum_1 = require("../enums/reputation.enum");
exports.reputationActivityPoint = {
    [reputation_enum_1.ReputationActivityTypeEnum.CREATE_QUESTION]: 0,
    [reputation_enum_1.ReputationActivityTypeEnum.UPDATE_QUESTION]: 0,
    [reputation_enum_1.ReputationActivityTypeEnum.CREATE_ANSWER]: 5,
    [reputation_enum_1.ReputationActivityTypeEnum.UPDATE_ANSWER]: 0,
    [reputation_enum_1.ReputationActivityTypeEnum.CREATE_COMMENT]: 2,
    [reputation_enum_1.ReputationActivityTypeEnum.UPDATE_COMMENT]: 0,
    [reputation_enum_1.ReputationActivityTypeEnum.UPVOTE]: 1,
    [reputation_enum_1.ReputationActivityTypeEnum.CANCLE_UPVOTE]: -1,
    [reputation_enum_1.ReputationActivityTypeEnum.CHANGE_DOWNVOTE_TO_UPVOTE]: 2,
    [reputation_enum_1.ReputationActivityTypeEnum.ACCEPT_ANSWER]: 20,
    [reputation_enum_1.ReputationActivityTypeEnum.DELETE_QUESTION]: 0,
    [reputation_enum_1.ReputationActivityTypeEnum.DELETE_ANSWER]: -5,
    [reputation_enum_1.ReputationActivityTypeEnum.DELETE_COMMENT]: -2,
    [reputation_enum_1.ReputationActivityTypeEnum.DOWNVOTE]: -1,
    [reputation_enum_1.ReputationActivityTypeEnum.CANCLE_DOWNVOTE]: 1,
    [reputation_enum_1.ReputationActivityTypeEnum.CHANGE_UPVOTE_TO_DOWNVOTE]: -2,
    [reputation_enum_1.ReputationActivityTypeEnum.UN_ACCEPT_ANSWER]: -20,
    [reputation_enum_1.ReputationActivityTypeEnum.BLOCK_QUESTION]: -10,
    [reputation_enum_1.ReputationActivityTypeEnum.UN_BLOCK_QUESTION]: 10,
    [reputation_enum_1.ReputationActivityTypeEnum.VERIFY_QUESTION]: 0,
    [reputation_enum_1.ReputationActivityTypeEnum.VERIFY_TAG]: 0,
};
//# sourceMappingURL=reputation.constants.js.map