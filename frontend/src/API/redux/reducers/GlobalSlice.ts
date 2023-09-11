import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "globalLoading",
  initialState: { loading: false },
  reducers: {
    requesting: (state) => {
      state.loading = true;
    },
    finishedRequest: (state) => {
      state.loading = false;
    },
  },
});

export const { requesting, finishedRequest } = loadingSlice.actions;
export default loadingSlice.reducer;
