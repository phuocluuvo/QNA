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
  FormVote,
  FormVoteAnswer,
  FromUserLogin,
} from "../type/Form.type";
import api, { AuthApi } from "./axios";
import { REQUEST_METHOD } from "../type/Request.type";
import { GetQuesionParams } from "../type/params/Question.params";
import { GetCommentAnswerParams } from "../type/params/Comment.params";
import { CommonParams } from "../type/params/Common.params";

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
  return AuthApi(REQUEST_METHOD.GET, url.QUESTION + "/" + form.id.toString());
};

const getQuestionList = (params: GetQuesionParams) => {
  return api.get(url.QUESTION_LIST, {
    params: params,
  });
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
  return api.get(url.ANSWER, {
    params: {
      page: form.page,
      limit: form.limit,
      question_id: form.question_id,
    },
  });
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

const getTag = (nameTag: string) => {
  return api.get(url.TAG.concat("/" + nameTag));
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
};
