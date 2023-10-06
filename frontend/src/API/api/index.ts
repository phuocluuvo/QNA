import axios, { AxiosRequestConfig } from "axios";
import { url } from "./url";
import {
  FormCreateQuestion,
  FormQuestion,
  FormSignUp,
  FromUserLogin,
} from "../type/Form.type";
import { getSession } from "next-auth/react";
const enum REQUEST_METHOD {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}
const baseURL = "http://localhost:3001";
let apiFormData = axios.create({
  baseURL,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});
// let token: string = "";
let api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

// async function getAuthorizeHeader() {
//   if (token !== "") {
//     return {
//       headers: { Authorization: token },
//     };
//   } else {
//     const storedUser = localStorage.getItem("userLogin");
//     if (storedUser) {
//       let user = JSON.parse(storedUser);
//       token = "Bearer " + user.accessToken;
//       return {
//         headers: {
//           Authorization: token,
//         },
//       };
//     } else {
//       return {};
//     }
//   }
// }

const getAuthorizeHeaderPromised = async (): Promise<
  AxiosRequestConfig<any>
> => {
  let token = "";
  const session = await getSession();
  if (session) {
    token = `Bearer ${session.user.accessToken}`;
  } else {
    const storedUser = localStorage.getItem("userLogin");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      token = `Bearer ${user.accessToken}`;
    }
  }
  if (token !== "") {
    return Promise.resolve({
      headers: { Authorization: token },
    });
  } else {
    const promise = new Promise<AxiosRequestConfig<any>>((resolve, reject) => {
      const storedUser = localStorage.getItem("userLogin");
      console.log("storedUser:", storedUser);
      if (storedUser) {
        let user = JSON.parse(storedUser);
        token = "Bearer " + user.accessToken;
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

// const setUserToken = (userToken: string) => {
//   token = "Bearer " + userToken;
// };

// const getUserToken = () => {
//   return token;
// };

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
// const requestUpdateUserProfile = (form: FormData) => {
//   removeEmpty(form);
//   return apiFormData.put(url.USER, form, {
//     headers: { Authorization: token },
//   });
// };

const getQuestion = (form: FormQuestion) => {
  return api.post(url.QUESTION + form.id, form);
};

const getQuestionList = () => {
  return api.post(url.QUESTION_LIST);
};

const createQuestion = (form: FormCreateQuestion) => {
  return makeApiRequestingWithAuthorized(
    REQUEST_METHOD.POST,
    url.QUESTION,
    form
  );
};

const requestSignIn = (form: FromUserLogin) => {
  return api.post(url.SIGN_IN, form);
};

const getRefreshToken = (token: { sub: string; refreshToken: string }) => {
  return api.get(url.REFRESH_TOKEN, {});
};

const signOut = () => {
  return makeApiRequestingWithAuthorized(REQUEST_METHOD.GET, url.SIGN_OUT, {});
};
export default {
  api,
  apiFormData,
  requestSignUp,
  // requestUpdateUserProfile,
  makeApiRequestingWithAuthorized,
  // setUserToken,
  // getUserToken,
  getQuestion,
  getQuestionList,
  createQuestion,
  requestSignIn,
  getRefreshToken,
  signOut,
};
