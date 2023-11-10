import { ReputationActivityTypeEnum } from "../enums/reputation.enum";

export const reputationActivityPoint = {
  [ReputationActivityTypeEnum.CREATE_QUESTION]: 10,
  [ReputationActivityTypeEnum.CREATE_ANSWER]: 5,
  [ReputationActivityTypeEnum.CREATE_COMMENT]: 2,
  [ReputationActivityTypeEnum.UPVOTE]: 1,
  [ReputationActivityTypeEnum.ACCEPT_ANSWER]: 20,

  [ReputationActivityTypeEnum.DELETE_QUESTION]: -10,
  [ReputationActivityTypeEnum.DELETE_ANSWER]: -5,
  [ReputationActivityTypeEnum.DELETE_COMMENT]: -2,
  [ReputationActivityTypeEnum.DOWNVOTE]: -1,
  [ReputationActivityTypeEnum.UN_ACCEPT_ANSWER]: -20,
};
