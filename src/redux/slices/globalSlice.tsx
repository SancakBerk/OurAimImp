import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface InitialStateTypes {
  isDarkMode: boolean;
  userId: string;
}

const initialState: InitialStateTypes = {
  isDarkMode: false,
  userId: "",
};

export const globalSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setModeToRedux: (state, actions: PayloadAction<boolean>) => {
      state.isDarkMode = actions.payload;
    },
    setUserIdToRedux: (state, actions: PayloadAction<string>) => {
      state.userId = actions.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setModeToRedux, setUserIdToRedux } = globalSlice.actions;

export default globalSlice.reducer;
