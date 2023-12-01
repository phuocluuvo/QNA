import { url } from "./url";
import {
  FormApproveAnswer,
  FormCommentAnswer,
  FormCreateAnswer,
  FormCreateQuestion,
  FormCreateTag,
  FormGetAnswer,
  FormQuestion,
  FormSignUp,
  FormUnblockedComment,
  FormUpdateProfile,
  FormVote,
  FormVoteAnswer,
  FromUserLogin,
} from "../type/Form.type";
import api, { AuthApi } from "./axios";
import { REQUEST_METHOD } from "../type/Request.type";
import { GetQuesionParams } from "../type/params/Question.params";
import { GetCommentAnswerParams } from "../type/params/Comment.params";
import { CommonParams } from "../type/params/Common.params";
import moment from "moment";
import { CommentType } from "@/util/type/Comment.type";

const requestSignUp = (form: FormSignUp) => {
  return api.post(url.SIGN_UP, form);
};
const removeEmpty = (obj: { [x: string]: any }) => {
  for (var key in obj) {
    if (undefined == obj[key] || obj[key].toString().trim() == "") {
      delete obj[key];
    }
  }
};

const getQuestion = (form: FormQuestion) => {
  return AuthApi("GET", url.QUESTION + "/" + form.id.toString());
};

const getQuestionList = (params: GetQuesionParams) => {
  let paramToURL = url.QUESTION_LIST + "?";
  for (let key in params) {
    // @ts-ignore
    paramToURL += key + "=" + params[key] + "&";
  }
  return AuthApi("GET", paramToURL);
};

const getQuestionWithRelatedTags = (params: GetQuesionParams) => {
  let paramToURL = url.QUESTION_LIST + "/related?";
  for (let key in params) {
    // @ts-ignore
    paramToURL += key + "=" + params[key] + "&";
  }
  return AuthApi("GET", paramToURL);
};

const createQuestion = (form: FormCreateQuestion | null) => {
  return AuthApi(REQUEST_METHOD.POST, url.QUESTION, form);
};

const voteQuestion = (form: FormVote) => {
  return AuthApi(REQUEST_METHOD.POST, url.VOTE_QUESTION, form);
};

const requestSignIn = (form: FromUserLogin) => {
  return api.post(url.SIGN_IN, form);
};

const signOut = () => {
  return AuthApi(REQUEST_METHOD.GET, url.SIGN_OUT);
};

const createAnswer = (form: FormCreateAnswer) => {
  // @ts-ignore
  return AuthApi(REQUEST_METHOD.POST, url.ANSWER, form);
};

const getAnswerList = (form: FormGetAnswer) => {
  let urlParams = url.ANSWER + "?";
  for (let key in form) {
    // @ts-ignore
    urlParams += key + "=" + form[key] + "&";
  }
  return AuthApi(REQUEST_METHOD.GET, urlParams);
};

const approveAnswer = (form: FormApproveAnswer) => {
  return AuthApi(REQUEST_METHOD.POST, url.APPROVE_ANSWER, form);
};
const searchTags = (name: string) => {
  return api.get(url.TAG, {
    params: {
      search: name,
      searchBy: "name",
      sortBy: "name",
    },
  });
};

const getTagByName = (name: string) => {
  return api.get(url.TAG.concat("/" + name));
};

const getTags = (form: CommonParams) => {
  return api.get(url.TAG, {
    params: form,
  });
};

const createTag = (form: FormCreateTag) => {
  return AuthApi(REQUEST_METHOD.POST, url.TAG, form);
};

const getUserDashBoard = () => {
  return AuthApi(REQUEST_METHOD.GET, url.USER_PROFILE);
};

const getUserDashBoardById = (id: string) => {
  return AuthApi(REQUEST_METHOD.GET, url.USER + "/info/" + id);
};

const voteAnswer = (form: FormVoteAnswer) => {
  return AuthApi(REQUEST_METHOD.POST, url.VOTE_ANSWER, form);
};

const createCommentAnswer = (form: FormCommentAnswer) => {
  return AuthApi(REQUEST_METHOD.POST, url.COMMENT, form);
};

const getCommentAnswer = (params: GetCommentAnswerParams) => {
  return AuthApi(REQUEST_METHOD.GET, url.COMMENT, params);
};

const updateQuestion = (form: FormCreateQuestion, questionId: string) => {
  return AuthApi(
    REQUEST_METHOD.PATCH,
    url.QUESTION.concat("/" + questionId),
    form
  );
};

const updateProfile = (form: FormUpdateProfile) => {
  removeEmpty(form);
  return AuthApi(REQUEST_METHOD.PATCH, url.USER_PROFILE, form);
};

const getTag = (nameTag: string) => {
  return api.get(url.TAG, {
    params: {
      search: nameTag,
      searchBy: "name",
      page: 1,
      limit: 1,
    },
  });
};

const getActivityHistory = (params: CommonParams) => {
  let urlString = url.ACTIVITY_HISTORY + "?";
  for (let key in params) {
    // @ts-ignore
    urlString += key + "=" + params[key] + "&";
  }
  return AuthApi(REQUEST_METHOD.GET, urlString);
};

export const sendMedia = (media: any, type: string) => {
  const data = new FormData();
  data.append("file", media);
  data.append("upload_preset", "chat-chit");
  data.append("cloud_name", "voluu");
  return fetch(`https://api.cloudinary.com/v1_1/voluu/${type}/upload`, {
    method: "POST",
    body: data,
  });
};

const getAllNotification = (params: CommonParams) => {
  // params to url
  let urlString = url.NOTIFICATION + "?";
  for (let key in params) {
    // @ts-ignore
    urlString += key + "=" + params[key] + "&";
  }
  return AuthApi(REQUEST_METHOD.GET, urlString);
};

const readNotification = (id: string) => {
  return AuthApi(REQUEST_METHOD.GET, url.NOTIFICATION + "/" + id);
};

const readAllNotification = () => {
  return AuthApi(REQUEST_METHOD.GET, url.NOTIFICATION + "/all");
};

const getBadgeNumber = () => {
  return AuthApi(REQUEST_METHOD.GET, url.BADGE_NOTIFICATION);
};

const getAllUsers = (params: CommonParams) => {
  // params to url
  let urlString = url.USER + "?";
  for (let key in params) {
    // @ts-ignore
    urlString += key + "=" + params[key] + "&";
  }
  return AuthApi(REQUEST_METHOD.GET, urlString);
};

const verifyQuesiton = (id: string) => {
  return AuthApi(REQUEST_METHOD.GET, url.QUESTION + "/" + id + "/verify");
};

const blockQuestion = (id: string) => {
  return AuthApi(REQUEST_METHOD.GET, url.QUESTION + "/" + id + "/block");
};

const verifyTag = (tagId: string) => {
  return AuthApi(REQUEST_METHOD.GET, url.TAG + "/" + tagId + "/verify");
};

const bookmarkQuestion = (questionId: string) => {
  return AuthApi(REQUEST_METHOD.POST, url.BOOKMARK, {
    question_id: questionId,
  });
};

const getAllBookmarks = () => {
  return AuthApi(REQUEST_METHOD.GET, url.BOOKMARK);
};

const getBookmarksFromCollections = (id: string) => {
  return AuthApi(
    REQUEST_METHOD.GET,
    url.BOOKMARK_COLLECTION.replace("{id}", id)
  );
};

const getUserById = (userId: string) => {
  return api.get(url.USER + "/" + userId);
};

const loginWithGoogle = (refreshToken: string) => {
  return api.post(url.GOOGLE_LOGIN, { refreshToken });
};
const checkUsernameExisted = (username: string) => {
  return api.get(url.CHECK_USERNAME, { params: { username } });
};
const forgotPassword = (username: string) => {
  return api.post(url.FORGOT_PASSWORD + "?username=" + username);
};
const resetPassword = (form: { password: string; uuid: string }) => {
  return api.post(url.RESET_PASSWORD, form);
};
const getAllCollections = () => {
  return AuthApi(REQUEST_METHOD.GET, url.COLLECTION);
};

const createCollection = (collectionName: string) => {
  return AuthApi(REQUEST_METHOD.POST, url.COLLECTION, { name: collectionName });
};

const addBookmarkToCollection = (collectionId: string, bookmarkId: string) => {
  if (collectionId !== "null") {
    console.log("__collectionId", collectionId);
    return AuthApi(REQUEST_METHOD.PATCH, url.BOOKMARK + "/" + bookmarkId, {
      collection_id: collectionId,
    });
  }

  return AuthApi(REQUEST_METHOD.PATCH, url.BOOKMARK + "/" + bookmarkId, {
    bookmarkId,
  });
};

const getQuestionHistory = (questionId: string) => {
  return AuthApi(
    REQUEST_METHOD.GET,
    url.QUESTION + "/" + questionId + "/history"
  );
};
const deleteCollection = (collectionId: string) => {
  return AuthApi(
    REQUEST_METHOD.DELETE,
    url.COLLECTION + "/" + collectionId,
    {}
  );
};

const updateColectionName = (collectionId: string, name: string) => {
  return AuthApi(REQUEST_METHOD.PATCH, url.COLLECTION + "/" + collectionId, {
    name,
  });
};

const deleteBookmark = (bookmarkId: string) => {
  return AuthApi(REQUEST_METHOD.DELETE, url.BOOKMARK + "/" + bookmarkId, {});
};

const getAnouncements = () => {
  return AuthApi(REQUEST_METHOD.GET, url.ANNOUNCEMENT);
};
const getAllQuesitonByUser = (userId: string, type: "votes" | "createdAt") => {
  return api.get(
    url.QUESTION + `?filter.user.id=${userId}&limit=10&sortBy=${type}:DESC`
  );
};
const getAllAnswerByUser = (userId: string, type: "votes" | "createdAt") => {
  let _url =
    url.ANSWER + `?filter.user.id=${userId}&limit=10&sortBy=${type}:DESC`;
  return api.get(_url);
};
const getAllTagsByUser = (
  userId: string,
  type: "questionsNumber" | "createdAt"
) => {
  // let paramToURL =
  //   url.TAG + `?filter.user.id=${userId}&limit=10&sortBy=${type}:DESC`;
  return AuthApi(
    REQUEST_METHOD.GET,
    url.TOP_TAG_USER.replace("{userId}", userId)
  );
};
const getAcitvityDashboardByUser = (userId: string, date = "all") => {
  return AuthApi(
    REQUEST_METHOD.GET,
    url.ACTIVITY_DASHBOARD_USER.replace("{id}", userId) + "?date=" + date
  );
};

const createCancelBlockedComment = (form: FormUnblockedComment) => {
  form.type = "undelete";
  console.log("form createCancelBlockedComment", form);
  // create the comment
  return AuthApi(REQUEST_METHOD.POST, url.COMMENT, form);
};

const unBlockQuestion = (questionId: string) => {
  return AuthApi(
    REQUEST_METHOD.GET,
    url.UNBLOCK_QUESTION.replace("{id}", questionId)
  );
};

const getFlagNumber = (id: string) => {
  return AuthApi(REQUEST_METHOD.GET, url.COUNT_FAG.replace("{id}", id));
};
export default {
  requestSignUp,
  getQuestion,
  getQuestionList,
  createQuestion,
  requestSignIn,
  signOut,
  createAnswer,
  getAnswerList,
  voteQuestion,
  approveAnswer,
  getTagByName,
  getUserDashBoard,
  voteAnswer,
  searchTags,
  createCommentAnswer,
  getCommentAnswer,
  createTag,
  getTags,
  updateQuestion,
  getTag,
  getActivityHistory,
  getAllNotification,
  readNotification,
  getBadgeNumber,
  getAllUsers,
  readAllNotification,
  verifyQuesiton,
  blockQuestion,
  verifyTag,
  updateProfile,
  bookmarkQuestion,
  getUserById,
  getAllBookmarks,
  loginWithGoogle,
  checkUsernameExisted,
  forgotPassword,
  resetPassword,
  getBookmarksFromCollections,
  getAllCollections,
  createCollection,
  addBookmarkToCollection,
  getQuestionHistory,
  getUserDashBoardById,
  deleteCollection,
  updateColectionName,
  deleteBookmark,
  getAnouncements,
  getQuestionWithRelatedTags,
  getAllQuesitonByUser,
  getAllAnswerByUser,
  getAllTagsByUser,
  getAcitvityDashboardByUser,
  createCancelBlockedComment,
  getFlagNumber,
  unBlockQuestion,
};
