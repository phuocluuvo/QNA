import { createAction } from "@reduxjs/toolkit";

import GlobalReducer from "./GlobalSlice";

const reducers = {
  GlobalReducer,
};

export const resetAll = createAction("ResetAll");
export default reducers;
