import moment from "moment";
import { HISTORY_ACTIVITY_TYPE } from "./type/HistoryActivity.enum";
import wordsExplictEn from "naughty-words/en.json";
import {
  NotificationDesEumn,
  NotificationEumn,
} from "./type/Notification.enum";
import removeMd from "remove-markdown";

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

export const createQuestionRules = `
A tag is a keyword or label that categorizes your question with other, similar questions. Choose one or more (up to 5) tags that will help answerers to find and interpret your question.

**Complete the sentence:** My question is about...

**Tags:**
- [reactjs] (if your question is about React development)
- [javascript] (if it involves JavaScript programming)
- [web-development] (for general web development questions)
- [github] (if it pertains to GitHub usage)
- [programming] (for questions related to programming concepts)

*Use tags that describe things or concepts that are essential, not incidental to your question. Favor using existing popular tags. Read the descriptions that appear below the tag. If your question is primarily about a topic for which you can't find a tag: combine multiple words into single-words with hyphens (e.g. python-3.x), up to a maximum of 35 characters. Creating new tags is a privilege; if you can't yet create a tag you need, then post this question without it, then ask the community to create it for you.*

`;
export const titleRules = `
Your title should summarize the problem.

You might find that you have a better idea of your title after writing out the rest of the question.
`;
const contentRules = `
Explain how you encountered the problem you’re trying to solve, and any difficulties that have prevented you from solving it yourself.
`;
export const writeAGoodQuestion = `
# Steps to Writing a Good Programming Question

## 1. Summarize your problem in a one-line title.

Choose a clear and concise title that summarizes your issue. It should give potential answerers a quick overview of your question.

Example: "Error when deploying React app to Heroku: 'Module not found'"

## 2. Describe your problem in more detail.

Provide a detailed explanation of the problem you're facing. Include relevant code snippets, error messages, or any other information that can help others understand your issue.

Example: 
I'm encountering an issue while trying to deploy my React app to Heroku. The specific error message is 'Module not found.' I've checked my dependencies, and everything seems fine locally. However, the problem arises during the deployment process. 

## 3. Describe what you tried and what you expected to happen.

Explain the steps you've taken to troubleshoot or solve the problem. Highlight any specific approaches you've tried, and be clear about what you expected the outcome to be.

Example:
I've double-checked my package.json, ensured all dependencies are up-to-date, and followed the Heroku deployment documentation. Locally, the app runs without any issues. However, when deploying to Heroku, the build fails with the mentioned 'Module not found' error.

## 4. Add “tags” which help surface your question to members of the community.

Use relevant tags to categorize your question. This helps others with similar expertise find and answer your question more efficiently.

Example:
- [reactjs]
- [heroku]
- [deployment]
- [javascript]

## 5. Review your question and post it to the site.

Before posting, review your question to ensure it's clear, well-formatted, and includes all necessary details. Make sure your title, description, and tags accurately represent your problem.

Once satisfied, go ahead and post your question to the community site, and be ready to engage with any clarifications or suggestions from fellow members.
`;
export const writeAGoodQuestionVie = `
# Cách Để Viết Một Câu Hỏi Lập Trình Chất Lượng, Xịn Sò

## 1. Tóm tắt vấn đề của bạn gọn trong một dòng tiêu đề.

Chọn một tiêu đề rõ ràng và ngắn gọn mô tả vấn đề của bạn. Nó nên cung cấp cho những người trả lời đầy đủ thông tin về câu hỏi của bạn.

Ví dụ: "Lỗi khi triển khai ứng dụng React lên Heroku: 'Module not found'"

## 2. Mô tả vấn đề của bạn chi tiết hơn.

Cung cấp một giải thích chi tiết về vấn đề bạn đang gặp phải. Bao gồm các đoạn code liên quan, thông báo lỗi, hoặc bất kỳ thông tin nào khác có thể giúp người khác hiểu vấn đề của bạn.

Ví dụ:
Tôi gặp vấn đề khi cố gắng triển khai ứng dụng React của mình lên Heroku. Thông báo lỗi cụ thể là 'Module not found.' Tôi đã kiểm tra các phụ thuộc, và mọi thứ đều ổn khi chạy ở cấp độ local. Tuy nhiên, vấn đề xảy ra trong quá trình triển khai.

## 3. Mô tả những gì bạn đã thử và mong đợi điều gì sẽ xảy ra.

Mô tả những bước bạn đã thực hiện để sửa chữa hoặc giải quyết vấn đề. Đặt mức độ chính xác về những gì bạn mong đợi sẽ xảy ra.

Ví dụ:
Tôi đã kiểm tra file package.json của mình, đảm bảo tất cả các phụ thuộc được cập nhật, và tuân theo tài liệu triển khai của Heroku. Tại cấp độ local, ứng dụng chạy mà không gặp vấn đề. Tuy nhiên, khi triển khai lên Heroku, quá trình xây dựng thất bại với lỗi 'Module not found' đã nêu.

## 4. Thêm "tag" hay thẻ giúp câu hỏi của bạn dễ dàng được tìm thấy.

Sử dụng các "tag" phù hợp để phân loại câu hỏi của bạn. Điều này giúp những người có chuyên môn tương tự dễ dàng tìm và trả lời câu hỏi của bạn hơn.

Ví dụ:
- [reactjs]
- [heroku]
- [triển khai]
- [javascript]

## 5. Xem lại câu hỏi và đăng lên trang.

Trước khi đăng, xem lại câu hỏi của bạn để đảm bảo nó rõ ràng, được định dạng đúng và bao gồm tất cả các chi tiết cần thiết. Hãy chắc chắn rằng tiêu đề, mô tả và các "tags" mô tả chính xác vấn đề của bạn.

Khi hài lòng, hãy đăng câu hỏi của bạn lên cộng đồng và sẵn sàng tham gia vào bất kỳ giải đáp hoặc gợi ý nào từ các thành viên khác.

`;
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
  removeVietnameseTones,
  createQuestionRules,
  titleRules,
  contentRules,
  writeAGoodQuestion,
  writeAGoodQuestionVie,
};
