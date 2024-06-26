import { ActionTypes } from "@/API/constant/ActionTypes.enum";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requesting: false,
  questionDetail: null,
  questionList: [],
  error: null,
  type: "",
};

const questionSlice = createSlice({
  name: "questionSlice",
  initialState: initialState,
  reducers: {
    requestGetQuestion: (state) => {
      state.requesting = true;
      state.questionDetail = null;
      state.type = ActionTypes.REQUEST_GET_QUESTION;
    },
    successGetQuestion: (state, actions) => {
      state.requesting = false;
      state.questionDetail = actions.payload;
      state.type = ActionTypes.SUCCESS_GET_QUESTION;
    },
    failureGetQuestion: (state, actions) => {
      state.requesting = false;
      state.questionDetail = null;
      state.error = actions.payload.error;
      state.type = ActionTypes.FAILURE_GET_QUESTION;
    },
    requestGetQuestionList: (state) => {
      state.requesting = true;
      state.questionList = [];
      state.type = ActionTypes.REQUEST_GET_QUESTION_LIST;
    },
    successGetQuestionList: (state, actions) => {
      state.requesting = false;
      state.questionList = actions.payload;
      state.type = ActionTypes.SUCCESS_GET_QUESTION_LIST;
    },
    failureGetQuestionList: (state, actions) => {
      state.requesting = false;
      state.questionList = [];
      state.error = actions.payload.error;
      state.type = ActionTypes.FAILURE_GET_QUESTION_LIST;
    },
    requestCreateQuestion: (state) => {
      state.requesting = true;
      state.type = ActionTypes.REQUEST_CREATE_QUESTION;
    },
    successCreateQuestion: (state, actions) => {
      state.requesting = false;
      state.type = ActionTypes.SUCCESS_CREATE_QUESTION;
      state.questionDetail = actions.payload;
    },
    failureCreateQuestion: (state, actions) => {
      state.requesting = false;
      state.error = actions.payload.error;
      state.type = ActionTypes.FAILURE_CREATE_QUESTION;
    },
  },
});

export const {
  requestGetQuestion,
  successGetQuestion,
  failureGetQuestion,
  requestGetQuestionList,
  successGetQuestionList,
  failureGetQuestionList,
  requestCreateQuestion,
  successCreateQuestion,
  failureCreateQuestion,
} = questionSlice.actions;

export default questionSlice.reducer;
