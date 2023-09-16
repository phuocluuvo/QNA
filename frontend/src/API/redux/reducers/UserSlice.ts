import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requesting: false,
  data: null,
  error: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState: initialState,
  reducers: {
    requestGetUser: (state, actions) => {
      state.requesting = true;
      state.data = actions.payload.data;
    },
    successGetUser: (state, actions) => {
      state.requesting = false;
      state.data = actions.payload.data;
    },
    failureGetUser: (state) => {
      state.requesting = false;
      state.data = null;
    },
  },
});

export const { requestGetUser, successGetUser, failureGetUser } =
  userSlice.actions;
export default userSlice.reducer;
