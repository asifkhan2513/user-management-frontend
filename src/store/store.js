import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import attendanceReducer from "./attendanceSlice";
import leaveReducer from "./leaveSlice";

const store = configureStore({
  reducer: {
    users: userReducer,
    attendance: attendanceReducer,
    leave: leaveReducer,
  },
});

export default store;
