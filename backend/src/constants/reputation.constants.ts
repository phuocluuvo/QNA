import { ActivityReputationTypeEnum } from "../enums/reputation.enum";

export const reputationActivityPoint = {
  [ActivityReputationTypeEnum.CREATE_QUESTION]: 10,
  [ActivityReputationTypeEnum.CREATE_ANSWER]: 5,
  [ActivityReputationTypeEnum.CREATE_COMMENT]: 2,
  [ActivityReputationTypeEnum.UPVOTE]: 1,
  [ActivityReputationTypeEnum.ACCEPT_ANSWER]: 20,

  [ActivityReputationTypeEnum.DELETE_QUESTION]: -10,
  [ActivityReputationTypeEnum.DELETE_ANSWER]: -5,
  [ActivityReputationTypeEnum.DELETE_COMMENT]: -2,
  [ActivityReputationTypeEnum.DOWNVOTE]: -1,
  [ActivityReputationTypeEnum.UN_ACCEPT_ANSWER]: -20,
};
