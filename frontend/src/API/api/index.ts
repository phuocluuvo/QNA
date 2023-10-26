import { url } from "./url";
import {
  FormApproveAnswer,
  FormCreateAnswer,
  FormCreateQuestion,
  FormGetAnswer,
  FormQuestion,
  FormSignUp,
  FormVote,
  FromUserLogin,
} from "../type/Form.type";
import api, { AuthApi } from "./axios";
import { REQUEST_METHOD } from "../type/Request.type";

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
  return api.get(url.QUESTION + "/" + form.id.toString());
};

const getQuestionList = ({ page, limit }: { page: number; limit: number }) => {
  return api.get(url.QUESTION_LIST + "?page=" + page + "&limit=" + limit);
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
  return api.get(
    url.ANSWER +
      "?page=" +
      form.page +
      "&limit=" +
      form.limit +
      "&question_id=" +
      form.question_id
  );
};

const approveAnswer = (form: FormApproveAnswer) => {
  return AuthApi(REQUEST_METHOD.POST, url.APPROVE_ANSWER, form);
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
};
