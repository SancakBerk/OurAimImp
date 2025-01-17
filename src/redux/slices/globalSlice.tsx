import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface InitialStateTypes {
  isDarkMode: boolean;
  userId: string;
  token: string;
  email: string;
  documentId: string;
}

const initialState: InitialStateTypes = {
  isDarkMode: false,
  email: "",
  token: "",
  userId: "",
  documentId: "",
};
interface LoginInitialStatesPayload {
  email: string;
  token: string;
  userId: string;
  documentId: string;
}

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setModeToLocalStorage: (state, actions) => {
      state.isDarkMode = actions.payload;
    },
    setLoginInitialStates: (
      state,
      actions: PayloadAction<LoginInitialStatesPayload>
    ) => {
      state.email = actions.payload.email;
      state.token = actions.payload.token;
      state.userId = actions.payload.userId;
      state.documentId = actions.payload.documentId;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setModeToLocalStorage, setLoginInitialStates } =
  counterSlice.actions;

export default counterSlice.reducer;
