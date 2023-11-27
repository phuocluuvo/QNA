export enum ReputationActivityTypeEnum {
  CREATE_QUESTION = "create_question",
  UPDATE_QUESTION = "update_question",
  CREATE_ANSWER = "create_answer",
  UPDATE_ANSWER = "update_answer",
  CREATE_COMMENT = "create_comment",
  UPDATE_COMMENT = "update_comment",
  UPVOTE = "up_vote",
  CANCLE_UPVOTE = "cancle_up_vote",
  CHANGE_DOWNVOTE_TO_UPVOTE = "change_down_vote_to_up_vote",
  ACCEPT_ANSWER = "accept_answer",

  DELETE_QUESTION = "delete_question",
  DELETE_ANSWER = "delete_answer",
  DELETE_COMMENT = "delete_comment",
  DOWNVOTE = "down_vote",
  CANCLE_DOWNVOTE = "cancle_down_vote",
  CHANGE_UPVOTE_TO_DOWNVOTE = "change_up_vote_to_down_vote",
  UN_ACCEPT_ANSWER = "un_accept_answer",

  BLOCK_QUESTION = "block_question",
  VERIFY_QUESTION = "verify_question",
  UN_BLOCK_QUESTION = "un_block_question",

  VERIFY_TAG = "verify_tag",
}

export enum ObjectActivityTypeEnum {
  QUESTION = "question",
  ANSWER = "answer",
  COMMENT = "comment",
  VOTE_QUESTION = "vote_question",
  VOTE_ANSWER = "vote_answer",
  TAG = "tag",
}
