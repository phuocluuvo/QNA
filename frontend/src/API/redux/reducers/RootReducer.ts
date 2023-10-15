import { createAction } from "@reduxjs/toolkit";

import GlobalReducer from "./GlobalSlice";
import UserSlice from "./UserSlice";
import QuestionSlice from "./QuestionSlice";
const reducers = {
  GlobalReducer,
  userReducer: UserSlice,
  questionReducer: QuestionSlice,
};

export const resetAll = createAction("ResetAll");
export default reducers;
