import { ActionTypes } from "@/API/constant/ActionTypes.enum";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requesting: false,
  error: null,
  type: "",
};

const answerSlice = createSlice({
  name: "answerSlice",
  initialState: initialState,
  reducers: {
    requestCreateAnswer: (state) => {
      state.requesting = true;
      state.type = ActionTypes.REQUEST_CREATE_ANSWER;
    },
    successCreateAnswer: (state) => {
      state.requesting = false;
      state.type = ActionTypes.SUCCESS_CREATE_ANSWER;
    },
    failureCreateAnswer: (state, actions) => {
      state.requesting = false;
      state.error = actions.payload.error;
      state.type = ActionTypes.FAILURE_CREATE_ANSWER;
    },
  },
});

export const { requestCreateAnswer, successCreateAnswer, failureCreateAnswer } =
  answerSlice.actions;

export default answerSlice.reducer;
