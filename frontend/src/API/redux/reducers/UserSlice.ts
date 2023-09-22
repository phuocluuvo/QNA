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
    requestGetUser: (state, actions) => {
      state.requesting = true;
      state.data = actions.payload.data;
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
  },
});

export const { requestGetUser, successGetUser, failureGetUser } =
  userSlice.actions;
export default userSlice.reducer;
