"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectActivityTypeEnum = exports.ReputationActivityTypeEnum = void 0;
var ReputationActivityTypeEnum;
(function (ReputationActivityTypeEnum) {
    ReputationActivityTypeEnum["CREATE_QUESTION"] = "create_question";
    ReputationActivityTypeEnum["UPDATE_QUESTION"] = "update_question";
    ReputationActivityTypeEnum["CREATE_ANSWER"] = "create_answer";
    ReputationActivityTypeEnum["UPDATE_ANSWER"] = "update_answer";
    ReputationActivityTypeEnum["CREATE_COMMENT"] = "create_comment";
    ReputationActivityTypeEnum["UPDATE_COMMENT"] = "update_comment";
    ReputationActivityTypeEnum["UPVOTE"] = "up_vote";
    ReputationActivityTypeEnum["CANCLE_UPVOTE"] = "cancle_up_vote";
    ReputationActivityTypeEnum["CHANGE_DOWNVOTE_TO_UPVOTE"] = "change_down_vote_to_up_vote";
    ReputationActivityTypeEnum["ACCEPT_ANSWER"] = "accept_answer";
    ReputationActivityTypeEnum["DELETE_QUESTION"] = "delete_question";
    ReputationActivityTypeEnum["DELETE_ANSWER"] = "delete_answer";
    ReputationActivityTypeEnum["DELETE_COMMENT"] = "delete_comment";
    ReputationActivityTypeEnum["DOWNVOTE"] = "down_vote";
    ReputationActivityTypeEnum["CANCLE_DOWNVOTE"] = "cancle_down_vote";
    ReputationActivityTypeEnum["CHANGE_UPVOTE_TO_DOWNVOTE"] = "change_up_vote_to_down_vote";
    ReputationActivityTypeEnum["UN_ACCEPT_ANSWER"] = "un_accept_answer";
    ReputationActivityTypeEnum["BLOCK_QUESTION"] = "block_question";
    ReputationActivityTypeEnum["VERIFY_QUESTION"] = "verify_question";
    ReputationActivityTypeEnum["UN_BLOCK_QUESTION"] = "un_block_question";
    ReputationActivityTypeEnum["VERIFY_TAG"] = "verify_tag";
})(ReputationActivityTypeEnum || (exports.ReputationActivityTypeEnum = ReputationActivityTypeEnum = {}));
var ObjectActivityTypeEnum;
(function (ObjectActivityTypeEnum) {
    ObjectActivityTypeEnum["QUESTION"] = "question";
    ObjectActivityTypeEnum["ANSWER"] = "answer";
    ObjectActivityTypeEnum["COMMENT"] = "comment";
    ObjectActivityTypeEnum["VOTE_QUESTION"] = "vote_question";
    ObjectActivityTypeEnum["VOTE_ANSWER"] = "vote_answer";
    ObjectActivityTypeEnum["TAG"] = "tag";
})(ObjectActivityTypeEnum || (exports.ObjectActivityTypeEnum = ObjectActivityTypeEnum = {}));
//# sourceMappingURL=reputation.enum.js.map