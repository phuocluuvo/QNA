import moment from "moment";
import { HISTORY_ACTIVITY_TYPE } from "./type/HistoryActivity.enum";
import wordsExplictEn from "naughty-words/en.json";
import {
  NotificationDesEumn,
  NotificationEumn,
} from "./type/Notification.enum";
const removeMd = require("remove-markdown");

export const markdownToPlainText = (markdown: string) => {
  return removeMd(markdown, {
    stripListLeaders: true,
    listUnicodeChar: "",
    gfm: true,
    useImgAltText: true,
  });
};

const formatDate = (date: string, useCount = false, formarter?: string) => {
  const datetime = moment(date);
  const days = datetime.fromNow();
  let _formater = formarter ? formarter : "DD/MM/YYYY";
  return useCount ? days : datetime.format(_formater);
};

const mappingState = <T, U>(oldState: T, updateObject: U): T & U => {
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
    case HISTORY_ACTIVITY_TYPE.CREATE_TAG:
      return "đã tạo thẻ";
    case HISTORY_ACTIVITY_TYPE.VERIFY_QUESTION:
      return "câu hỏi đã được duyệt";
    case HISTORY_ACTIVITY_TYPE.VERIFY_TAG:
      return "thẻ đã được duyệt";
    case HISTORY_ACTIVITY_TYPE.BLOCK_QUESTION:
      return "đã bị ẩn vì vi phạm các quy tắc";
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
    case HISTORY_ACTIVITY_TYPE.CREATE_TAG:
      return "created a tag";
    case HISTORY_ACTIVITY_TYPE.VERIFY_QUESTION:
      return "question has been verified";
    case HISTORY_ACTIVITY_TYPE.VERIFY_TAG:
      return "tag has been verified";
    case HISTORY_ACTIVITY_TYPE.BLOCK_QUESTION:
      return "has been hidden due to violation of the rules";
    default:
      return "";
  }
};
const getTranslationFromNotificationVi = (noti_type: NotificationEumn) => {
  switch (noti_type) {
    case NotificationEumn.CREATED_QUESTION:
      return "đã đăng một câu hỏi";
    case NotificationEumn.UPDATED_QUESTION:
      return "đã cập nhật câu hỏi";
    case NotificationEumn.DELETED_QUESTION:
      return "đã xóa câu hỏi";
    case NotificationEumn.CREATED_ANSWER:
      return "đã trả lời câu hỏi";
    case NotificationEumn.UPDATED_ANSWER:
      return "đã cập nhật câu trả lời";
    case NotificationEumn.DELETED_ANSWER:
      return "đã xóa câu trả lời";
    case NotificationEumn.ACCEPTED_ANSWER:
      return "đã chấp nhận câu trả lời";
    case NotificationEumn.UN_APPROVED_ANSWER:
      return "đã hủy câu trả lời được chấp nhận";
    case NotificationEumn.CREATED_COMMENT:
      return "đã bình luận";
    case NotificationEumn.UPDATED_COMMENT:
      return "đã cập nhật bình luận";
    case NotificationEumn.DELETED_COMMENT:
      return "đã xóa bình luận";
    case NotificationEumn.UP_VOTE:
      return "đã upvote";
    case NotificationEumn.DOWN_VOTE:
      return "đã downvote";
    case NotificationEumn.CANCEL_UP_VOTE:
      return "đã hủy upvote";
    case NotificationEumn.CANCEL_DOWN_VOTE:
      return "đã hủy downvote";
    case NotificationEumn.CHANGE_VOTE_UP_TO_DOWN:
      return "đã đổi upvote thành downvote";
    case NotificationEumn.CHANGE_VOTE_DOWN_TO_UP:
      return "đã đổi downvote thành upvote";
    default:
      return "";
  }
};

const getTranslationFromNotificationEn = (
  noti_type: NotificationEumn | string
) => {
  switch (noti_type) {
    case NotificationEumn.CREATED_QUESTION:
      return "created a question";
    case NotificationEumn.UPDATED_QUESTION:
      return "updated a question";
    case NotificationEumn.DELETED_QUESTION:
      return "deleted a question";
    case NotificationEumn.CREATED_ANSWER:
      return "created an answer";
    case NotificationEumn.UPDATED_ANSWER:
      return "updated an answer";
    case NotificationEumn.DELETED_ANSWER:
      return "deleted an answer";
    case NotificationEumn.ACCEPTED_ANSWER:
      return "accepted an answer";
    case NotificationEumn.UN_APPROVED_ANSWER:
      return "unaccepted an answer";
    case NotificationEumn.CREATED_COMMENT:
      return "commented";
    case NotificationEumn.UPDATED_COMMENT:
      return "updated a comment";
    case NotificationEumn.DELETED_COMMENT:
      return "deleted a comment";
    case NotificationEumn.UP_VOTE:
      return "upvoted";
    case NotificationEumn.DOWN_VOTE:
      return "downvoted";
    case NotificationEumn.CANCEL_UP_VOTE:
      return "cancled upvote";
    case NotificationEumn.CANCEL_DOWN_VOTE:
      return "cancled downvote";
    case NotificationEumn.CHANGE_VOTE_UP_TO_DOWN:
      return "changed upvote to downvote";
    case NotificationEumn.CHANGE_VOTE_DOWN_TO_UP:
      return "changed downvote to upvote";
    default:
      return noti_type;
  }
};

function getDescriptionFromNotificationVi(type: NotificationDesEumn | string) {
  switch (type) {
    case NotificationDesEumn.DESCRIPTION_CREATED_QUESTION:
      return "đã đăng một câu hỏi";
    case NotificationDesEumn.DESCRIPTION_UPDATED_QUESTION:
      return "đã cập nhật câu hỏi";
    case NotificationDesEumn.DESCRIPTION_DELETED_QUESTION:
      return "đã xóa câu hỏi";
    case NotificationDesEumn.DESCRIPTION_CREATED_ANSWER:
      return "đã trả lời câu hỏi";
    case NotificationDesEumn.DESCRIPTION_UPDATED_ANSWER:
      return "đã cập nhật câu trả lời";
    case NotificationDesEumn.DESCRIPTION_DELETED_ANSWER:
      return "đã xóa câu trả lời";
    case NotificationDesEumn.DESCRIPTION_ACCEPTED_ANSWER:
      return "đã chấp nhận câu trả lời";
    case NotificationDesEumn.DESCRIPTION_UN_APPROVED_ANSWER:
      return "đã hủy câu trả lời được chấp nhận";
    case NotificationDesEumn.DESCRIPTION_CREATED_COMMENT:
      return "đã bình luận";
    case NotificationDesEumn.DESCRIPTION_UPDATED_COMMENT:
      return "đã cập nhật bình luận";
    case NotificationDesEumn.DESCRIPTION_DELETED_COMMENT:
      return "đã xóa bình luận";
    case NotificationDesEumn.DESCRIPTION_UP_VOTE:
      return "đã upvote";
    case NotificationDesEumn.DESCRIPTION_DOWN_VOTE:
      return "đã downvote";
    case NotificationDesEumn.DESCRIPTION_CANCEL_UP_VOTE:
      return "đã hủy upvote";
    case NotificationDesEumn.DESCRIPTION_CANCEL_DOWN_VOTE:
      return "đã hủy downvote";
    case NotificationDesEumn.DESCRIPTION_CHANGE_VOTE_UP_TO_DOWN:
      return "đã đổi upvote thành downvote";
    case NotificationDesEumn.DESCRIPTION_CHANGE_VOTE_DOWN_TO_UP_VOTE:
      return "đã đổi downvote thành upvote";
    default:
      return type;
  }
}

function getDescriptionFromNotificationEn(type: NotificationDesEumn) {
  switch (type) {
    case NotificationDesEumn.DESCRIPTION_CREATED_QUESTION:
      return "created a question";
    case NotificationDesEumn.DESCRIPTION_UPDATED_QUESTION:
      return "updated a question";
    case NotificationDesEumn.DESCRIPTION_DELETED_QUESTION:
      return "deleted a question";
    case NotificationDesEumn.DESCRIPTION_CREATED_ANSWER:
      return "created an answer";
    case NotificationDesEumn.DESCRIPTION_UPDATED_ANSWER:
      return "updated an answer";
    case NotificationDesEumn.DESCRIPTION_DELETED_ANSWER:
      return "deleted an answer";
    case NotificationDesEumn.DESCRIPTION_ACCEPTED_ANSWER:
      return "accepted an answer";
    case NotificationDesEumn.DESCRIPTION_UN_APPROVED_ANSWER:
      return "unaccepted an answer";
    case NotificationDesEumn.DESCRIPTION_CREATED_COMMENT:
      return "commented";
    case NotificationDesEumn.DESCRIPTION_UPDATED_COMMENT:
      return "updated a comment";
    case NotificationDesEumn.DESCRIPTION_DELETED_COMMENT:
      return "deleted a comment";
    case NotificationDesEumn.DESCRIPTION_UP_VOTE:
      return "upvoted";
    case NotificationDesEumn.DESCRIPTION_DOWN_VOTE:
      return "downvoted";
    case NotificationDesEumn.DESCRIPTION_CANCEL_UP_VOTE:
      return "cancled upvote";
    case NotificationDesEumn.DESCRIPTION_CANCEL_DOWN_VOTE:
      return "cancled downvote";
    case NotificationDesEumn.DESCRIPTION_CHANGE_VOTE_UP_TO_DOWN:
      return "changed upvote to downvote";
    case NotificationDesEumn.DESCRIPTION_CHANGE_VOTE_DOWN_TO_UP_VOTE:
      return "changed downvote to upvote";
    default:
      return type;
  }
}
const checkExplictWords = (htmlString: string) => {
  let isExplict = false;
  let stringExplictWords: string[] = [];

  wordsExplictEn.forEach((word) => {
    let regex = new RegExp(`\\b${word}\\b`, "gi");
    if (regex.test(htmlString)) {
      isExplict = true;
      htmlString = htmlString.replace(
        regex,
        (match) => `<span style="color: red;">${match}</span>`
      );
      stringExplictWords.push(word);
    }
  });

  return {
    isExplict,
    explictWords: stringExplictWords,
    warningNewContent: htmlString,
  };
};
function gaurdsRouteRoles(
  userRole: "admin" | "user" | "moderator",
  callback: () => void,
  callbackError: () => void
) {
  let roles = ["admin", "moderator"];
  if (roles.includes(userRole)) {
    callback();
  } else {
    callbackError();
  }
}

export function removeVietnameseTones(str: string) {
  str = str
    .normalize("NFD") // decompose special characters
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D") // replace đ and Đ
    .toLowerCase() // convert to lower case
    .trim() // remove spaces from both ends
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/[^\w\-]+/g, "") // remove all non-word chars
    .replace(/\-\-+/g, "-"); // replace multiple hyphens with a single hyphen
  return str;
}
export default {
  numberFormat,
  formatDate,
  mappingState,
  getTranslationFromHistoryAcitvityVi,
  getTranslationFromHistoryAcitvityEn,
  getTranslationFromNotificationVi,
  getTranslationFromNotificationEn,
  getDescriptionFromNotificationVi,
  getDescriptionFromNotificationEn,
  checkExplictWords,
  gaurdsRouteRoles,
};
