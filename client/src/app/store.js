import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import chatReducer from "../features/chat/chatSlice";
import menuReducer from "../features/menu/menuSlice";
import providersReducer from "../features/providers/providersSlice";
import authReducer from "../features/auth/authSlice";
import serverReducer from "../features/server/serverSlice";

// Configuration object for redux-persist.
// Only objects on the whitelist are stored.
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  // whitelist: ["files", "status", "error"],
};

// Combine reducers
const rootReducer = combineReducers({
  chat: chatReducer,
  menu: menuReducer,
  providers: providersReducer,
  auth: authReducer,
  server: serverReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      // serializableCheck: {
      //   // Ignore these action types
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'dataReader/updateFilterDate'],
      // },
    }),
});

// The Redux persistor for persisting store state.
export const persistor = persistStore(store);
