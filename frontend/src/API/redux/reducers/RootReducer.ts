import { createAction } from "@reduxjs/toolkit";

import GlobalReducer from "./GlobalSlice";
import UserSlice from "./UserSlice";
import QuestionSlice from "./QuestionSlice";
import AnswerSlice from "./AnswerSlice";
import NotificationSlice from "./NotificationSlice";
const reducers = {
  GlobalReducer,
  userReducer: UserSlice,
  questionReducer: QuestionSlice,
  answerReducer: AnswerSlice,
  notificationReducer: NotificationSlice,
};

export const resetAll = createAction("ResetAll");
export default reducers;
