// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "../features/auth/authSlice";
// import accountReducer from "../features/accounts/accountSlice";
// import contactReducer from "../features/contacts/contactSlice";
// import dealReducer from "../features/deals/dealSlice";

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     accounts: accountReducer,
//     contacts: contactReducer,
//     deals: dealReducer,
//   },
//   devTools: import.meta.env.DEV,
// });

// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import accountReducer from "../features/accounts/accountSlice";
import contactReducer from "../features/contacts/contactSlice";
import dealReducer from "../features/deals/dealSlice";
import analyticsReducer from "../features/analytics/analyticsSlice";
import taskReducer from "../features/tasks/taskSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import dealRiskReducer from "../features/analytics/dealRiskSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountReducer,
    contacts: contactReducer,
    deals: dealReducer,
    analytics: analyticsReducer,
    tasks: taskReducer,
    notifications: notificationReducer,
    dealRisk: dealRiskReducer,
  },
  devTools: import.meta.env.DEV,
});