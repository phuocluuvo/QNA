import moment from "moment";
import { HISTORY_ACTIVITY_TYPE } from "./type/HistoryActivity.enum";

const formatDate = (date: string, useCount = false, formarter?: string) => {
  const datetime = moment(date);
  const days = datetime.fromNow();
  let _formater = formarter ? formarter : "DD/MM/YYYY";
  return useCount ? days : datetime.format(_formater);
};

const mappingState = (oldState: object, updateObject: object) => {
  const newState = { ...oldState, ...updateObject };
  return newState;
};

const numberFormat = (number: number | string) => {
  if (typeof number === "string") number = parseInt(number);
  if (number < 1000) return number;
  if (number >= 1000 && number < 1000000)
    return (number / 1000).toFixed(1) + "K";
  if (number >= 1000000 && number < 1000000000)
    return (number / 1000000).toFixed(1) + "M";
  if (number >= 1000000000 && number < 1000000000000)
    return (number / 1000000000).toFixed(1) + "B";
  if (number >= 1000000000000) return (number / 1000000000000).toFixed(1) + "T";
};

const getTranslationFromHistoryAcitvityVi = (
  activity: HISTORY_ACTIVITY_TYPE
) => {
  switch (activity) {
    case HISTORY_ACTIVITY_TYPE.CREATE_QUESTION:
      return "đã đăng một câu hỏi";
    case HISTORY_ACTIVITY_TYPE.UPDATE_QUESTION:
      return "đã cập nhật câu hỏi";
    case HISTORY_ACTIVITY_TYPE.CREATE_ANSWER:
      return "đã trả lời câu hỏi";
    case HISTORY_ACTIVITY_TYPE.UPDATE_ANSWER:
      return "đã cập nhật câu trả lời";
    case HISTORY_ACTIVITY_TYPE.CREATE_COMMENT:
      return "đã bình luận";
    case HISTORY_ACTIVITY_TYPE.UPDATE_COMMENT:
      return "đã cập nhật bình luận";
    case HISTORY_ACTIVITY_TYPE.UPVOTE:
      return "đã upvote";
    case HISTORY_ACTIVITY_TYPE.CANCLE_UPVOTE:
      return "đã hủy upvote";
    case HISTORY_ACTIVITY_TYPE.CHANGE_DOWNVOTE_TO_UPVOTE:
      return "đã đổi downvote thành upvote";
    case HISTORY_ACTIVITY_TYPE.ACCEPT_ANSWER:
      return "đã chấp nhận câu trả lời";
    case HISTORY_ACTIVITY_TYPE.DELETE_QUESTION:
      return "đã xóa câu hỏi";
    case HISTORY_ACTIVITY_TYPE.DELETE_ANSWER:
      return "đã xóa câu trả lời";
    case HISTORY_ACTIVITY_TYPE.DELETE_COMMENT:
      return "đã xóa bình luận";
    case HISTORY_ACTIVITY_TYPE.DOWNVOTE:
      return "đã downvote";
    case HISTORY_ACTIVITY_TYPE.CANCLE_DOWNVOTE:
      return "đã hủy downvote";
    case HISTORY_ACTIVITY_TYPE.CHANGE_UPVOTE_TO_DOWNVOTE:
      return "đã đổi upvote thành downvote";
    case HISTORY_ACTIVITY_TYPE.UN_ACCEPT_ANSWER:
      return "đã hủy câu trả lời được chấp nhận";
    default:
      return "";
  }
};

const getTranslationFromHistoryAcitvityEn = (
  activity: HISTORY_ACTIVITY_TYPE
) => {
  switch (activity) {
    case HISTORY_ACTIVITY_TYPE.CREATE_QUESTION:
      return "created a question";
    case HISTORY_ACTIVITY_TYPE.UPDATE_QUESTION:
      return "updated a question";
    case HISTORY_ACTIVITY_TYPE.CREATE_ANSWER:
      return "created an answer";
    case HISTORY_ACTIVITY_TYPE.UPDATE_ANSWER:
      return "updated an answer";
    case HISTORY_ACTIVITY_TYPE.CREATE_COMMENT:
      return "commented";
    case HISTORY_ACTIVITY_TYPE.UPDATE_COMMENT:
      return "updated a comment";
    case HISTORY_ACTIVITY_TYPE.UPVOTE:
      return "upvoted";
    case HISTORY_ACTIVITY_TYPE.CANCLE_UPVOTE:
      return "cancled upvote";
    case HISTORY_ACTIVITY_TYPE.CHANGE_DOWNVOTE_TO_UPVOTE:
      return "changed downvote to upvote";
    case HISTORY_ACTIVITY_TYPE.ACCEPT_ANSWER:
      return "accepted an answer";
    case HISTORY_ACTIVITY_TYPE.DELETE_QUESTION:
      return "deleted a question";
    case HISTORY_ACTIVITY_TYPE.DELETE_ANSWER:
      return "deleted an answer";
    case HISTORY_ACTIVITY_TYPE.DELETE_COMMENT:
      return "deleted a comment";
    case HISTORY_ACTIVITY_TYPE.DOWNVOTE:
      return "downvoted";
    case HISTORY_ACTIVITY_TYPE.CANCLE_DOWNVOTE:
      return "cancled downvote";
    case HISTORY_ACTIVITY_TYPE.CHANGE_UPVOTE_TO_DOWNVOTE:
      return "changed upvote to downvote";
    case HISTORY_ACTIVITY_TYPE.UN_ACCEPT_ANSWER:
      return "unaccepted an answer";
    default:
      return "";
  }
};

export default {
  numberFormat,
  formatDate,
  mappingState,
  getTranslationFromHistoryAcitvityVi,
  getTranslationFromHistoryAcitvityEn,
};
