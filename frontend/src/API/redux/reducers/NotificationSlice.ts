import { ActionTypes } from "@/API/constant/ActionTypes.enum";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requesting: false,
  error: null,
  type: "",
  typeBadge: "",
  notificationList: [],
  badgeNumber: 0,
};

const notificationSlice = createSlice({
  name: "notificationSlice",
  initialState: initialState,
  reducers: {
    requestGetNotificationList: (state) => {
      state.requesting = true;
      state.type = ActionTypes.REQUEST_GET_NOTIFICATION_LIST;
    },
    successGetNotificationList: (state, actions) => {
      state.requesting = false;
      state.error = null;
      state.notificationList = actions.payload;
      state.type = ActionTypes.SUCCESS_GET_NOTIFICATION_LIST;
    },
    failureGetNotificationList: (state, actions) => {
      state.requesting = false;
      state.error = actions.payload.error;
      state.type = ActionTypes.FAILURE_GET_NOTIFICATION_LIST;
    },
  },
});

export const {
  requestGetNotificationList,
  successGetNotificationList,
  failureGetNotificationList,
} = notificationSlice.actions;

export default notificationSlice.reducer;
