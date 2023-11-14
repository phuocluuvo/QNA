import { ReputationActivityTypeEnum } from "../enums/reputation.enum";

export const reputationActivityPoint = {
  [ReputationActivityTypeEnum.CREATE_QUESTION]: 10,
  [ReputationActivityTypeEnum.UPDATE_QUESTION]: 0,
  [ReputationActivityTypeEnum.CREATE_ANSWER]: 5,
  [ReputationActivityTypeEnum.UPDATE_ANSWER]: 0,
  [ReputationActivityTypeEnum.CREATE_COMMENT]: 2,
  [ReputationActivityTypeEnum.UPDATE_COMMENT]: 0,
  [ReputationActivityTypeEnum.UPVOTE]: 1,
  [ReputationActivityTypeEnum.CANCLE_UPVOTE]: -1,
  [ReputationActivityTypeEnum.CHANGE_DOWNVOTE_TO_UPVOTE]: 2,
  [ReputationActivityTypeEnum.ACCEPT_ANSWER]: 20,

  [ReputationActivityTypeEnum.DELETE_QUESTION]: -10,
  [ReputationActivityTypeEnum.DELETE_ANSWER]: -5,
  [ReputationActivityTypeEnum.DELETE_COMMENT]: -2,
  [ReputationActivityTypeEnum.DOWNVOTE]: -1,
  [ReputationActivityTypeEnum.CANCLE_DOWNVOTE]: 1,
  [ReputationActivityTypeEnum.CHANGE_UPVOTE_TO_DOWNVOTE]: -2,
  [ReputationActivityTypeEnum.UN_ACCEPT_ANSWER]: -20,
};
