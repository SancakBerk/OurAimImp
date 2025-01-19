import { configureStore } from "@reduxjs/toolkit";
import globalSlice from "./slices/globalSlice";
import homePageSlice from "./slices/homePageSlice";

export const store = configureStore({
  reducer: {
    globalSlice: globalSlice,
    homePageSlice: homePageSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
