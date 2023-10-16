import { ActionTypes } from "@/API/constant/ActionTypes.enum";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requesting: false,
  data: null,
  error: null,
  type: "",
};

const userSlice = createSlice({
  name: "userSlice",
  initialState: initialState,
  reducers: {
    requestSignIn: (state) => {
      state.requesting = true;
      state.type = ActionTypes.REQUEST_SIGN_IN;
      state.error = null;
    },
    successSignIn: (state, actions) => {
      state.requesting = false;
      state.data = actions.payload.data;
      state.type = ActionTypes.SUCCESS_SIGN_IN;
      state.error = null;
    },
    failureSignIn: (state, actions) => {
      state.requesting = false;
      state.data = null;
      state.error = actions.payload.error;
      state.type = ActionTypes.FAILURE_SIGN_IN;
    },
    requestGetUser: (state) => {
      state.requesting = true;
      state.type = ActionTypes.REQUEST_GET_USER;
      state.error = null;
    },
    successGetUser: (state, actions) => {
      state.requesting = false;
      state.data = actions.payload.data;
      state.type = ActionTypes.SUCCESS_GET_USER;
      state.error = null;
    },
    failureGetUser: (state, actions) => {
      state.requesting = false;
      state.data = null;
      state.error = actions.payload.error;
      state.type = ActionTypes.FAILURE_GET_USER;
    },
    successCheckUserExist: (state, actions) => {
      state.requesting = false;
      state.data = actions.payload.data;
      state.error = null;
      state.type = ActionTypes.SUCESS_CHECK_USER_EXIST;
    },
    failureCheckUserExist: (state, actions) => {
      state.requesting = false;
      state.data = null;
      state.error = actions.payload.error;
      state.type = ActionTypes.FAILURE_CHECK_USER_EXIST;
    },
  },
});

export const {
  requestGetUser,
  successGetUser,
  failureGetUser,
  successSignIn,
  failureSignIn,
  requestSignIn,
} = userSlice.actions;
export default userSlice.reducer;
