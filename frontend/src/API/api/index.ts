import axios, { AxiosRequestConfig } from "axios";
import { url } from "./url";
import { FormQuestion } from "../type/Form.type";
const enum REQUEST_METHOD {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}
let apiFormData = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});
let token: string = "";
let api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

async function getAuthorizeHeader() {
  if (token !== "") {
    return {
      headers: { Authorization: token },
    };
  } else {
    const storedUser = localStorage.getItem("userLogin");
    if (storedUser) {
      let user = JSON.parse(storedUser);
      token = "Bearer " + user._token;
      return {
        headers: {
          Authorization: token,
        },
      };
    } else {
      return {};
    }
  }
}

const getAuthorizeHeaderPromised = async (): Promise<
  AxiosRequestConfig<any>
> => {
  if (token !== "") {
    return Promise.resolve({
      headers: { Authorization: token },
    });
  } else {
    const promise = new Promise<AxiosRequestConfig<any>>((resolve, reject) => {
      const storedUser = localStorage.getItem("userLogin");
      if (storedUser) {
        let user = JSON.parse(storedUser);
        token = "Bearer " + user._token;
        resolve({
          headers: {
            Authorization: token,
          },
        });
      } else {
        reject("Error unAuthorized");
      }
    });
    try {
      return await promise;
    } catch (error) {
      throw error;
    }
  }
};

const makeApiRequestingWithAuthorized = async (
  requestType: "GET" | "POST" | "PUT" | "DELETE",
  apiUrl: any,
  data: any,
  apiInstance = api
) => {
  try {
    let authorizeConfig: AxiosRequestConfig<any> =
      await getAuthorizeHeaderPromised();
    if (requestType === REQUEST_METHOD.GET) {
      return apiInstance.get(apiUrl, authorizeConfig);
    } else if (requestType === REQUEST_METHOD.POST) {
      return apiInstance.post(apiUrl, data, authorizeConfig);
    } else if (requestType === REQUEST_METHOD.PUT) {
      return apiInstance.put(apiUrl, data, authorizeConfig);
    } else if (requestType === REQUEST_METHOD.DELETE) {
      return apiInstance.delete(apiUrl, authorizeConfig);
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const setUserToken = (userToken: string) => {
  token = "Bearer " + userToken;
};

const getUserToken = () => {
  return token;
};

const requestSignUp = (form: FormData) => {
  return api.post(url.USER, form);
};
const removeEmpty = (obj: { [x: string]: any }) => {
  for (var key in obj) {
    if (undefined == obj[key] || obj[key].toString().trim() == "") {
      delete obj[key];
    }
  }
};
const requestUpdateUserProfile = (form: FormData) => {
  removeEmpty(form);
  return apiFormData.put(url.USER, form, {
    headers: { Authorization: token },
  });
};

const getQuestion = (form: FormQuestion) => {
  return api.post(url.QUESTION, form);
};

const getQuestionList = () => {
  return api.post(url.QUESTION_LIST);
};

export default {
  api,
  apiFormData,
  requestSignUp,
  requestUpdateUserProfile,
  makeApiRequestingWithAuthorized,
  setUserToken,
  getUserToken,
  getQuestion,
  getQuestionList,
};
