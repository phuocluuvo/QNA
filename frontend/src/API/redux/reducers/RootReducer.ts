import { createAction } from "@reduxjs/toolkit";

import GlobalReducer from "./GlobalSlice";
import UserSlice from "./UserSlice";
const reducers = {
  GlobalReducer,
  UserSlice,
};

export const resetAll = createAction("ResetAll");
export default reducers;
