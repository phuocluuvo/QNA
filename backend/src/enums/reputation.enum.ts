export enum ReputationActivityTypeEnum {
  CREATE_QUESTION = "create_question",
  CREATE_ANSWER = "create_answer",
  CREATE_COMMENT = "create_comment",
  UPVOTE = "up_vote",
  ACCEPT_ANSWER = "accept_answer",

  DELETE_QUESTION = "delete_question",
  DELETE_ANSWER = "delete_answer",
  DELETE_COMMENT = "delete_comment",
  DOWNVOTE = "down_vote",
  UN_ACCEPT_ANSWER = "un_accept_answer",
}

export enum ObjectActivityTypeEnum {
  QUESTION = "question",
  ANSWER = "answer",
  COMMENT = "comment",
  VOTE_QUESTION = "vote_question",
  VOTE_ANSWER = "vote_answer",
}
