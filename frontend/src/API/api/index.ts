import { url } from "./url";
import {
  FormCreateQuestion,
  FormQuestion,
  FormSignUp,
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
  return api.get(url.QUESTION.replace("{id}", form.id.toString()));
};

const getQuestionList = () => {
  return api.get(url.QUESTION_LIST);
};

const createQuestion = (form: FormCreateQuestion) => {
  return AuthApi(REQUEST_METHOD.POST, url.QUESTION, form);
};

const requestSignIn = (form: FromUserLogin) => {
  return api.post(url.SIGN_IN, form);
};

const signOut = () => {
  return AuthApi(REQUEST_METHOD.GET, url.SIGN_OUT, {});
};
export default {
  requestSignUp,
  getQuestion,
  getQuestionList,
  createQuestion,
  requestSignIn,
  signOut,
};
