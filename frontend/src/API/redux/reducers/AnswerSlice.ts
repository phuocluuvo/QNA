import { ActionTypes } from "@/API/constant/ActionTypes.enum";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requesting: false,
  error: null,
  type: "",
  answerList: [],
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
    requestGetAnswerList: (state) => {
      state.requesting = true;
      state.type = ActionTypes.REQUEST_GET_ANSWER_LIST;
    },
    sucessGetAnswerList: (state, actions) => {
      state.requesting = false;
      state.error = null;
      state.answerList = actions.payload;
      state.type = ActionTypes.SUCCESS_GET_ANSWER;
    },
    failureGetAnswerList: (state, actions) => {
      state.requesting = false;
      state.error = actions.payload.error;
      state.type = ActionTypes.FAILURE_GET_ANSWER;
    },
  },
});

export const {
  requestCreateAnswer,
  successCreateAnswer,
  failureCreateAnswer,
  sucessGetAnswerList,
  requestGetAnswerList,
  failureGetAnswerList,
} = answerSlice.actions;

export default answerSlice.reducer;
