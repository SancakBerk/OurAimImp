import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserInformationTypes {
  email: string;
  userId: string;
  documentId: string;
}

export interface InitialStateTypes {
  isDarkMode: boolean;
  userInformation: UserInformationTypes;
}

const initialState: InitialStateTypes = {
  isDarkMode: false,
  userInformation: {
    email: "",
    userId: "",
    documentId: "",
  },
};
interface LoginInitialStatesPayload {
  email: string;
  userId: string;
  documentId: string;
}

export const globalSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setModeToRedux: (state, actions: PayloadAction<boolean>) => {
      state.isDarkMode = actions.payload;
    },
    setLoginInitialStates: (
      state,
      actions: PayloadAction<LoginInitialStatesPayload>
    ) => {
      state.userInformation.email = actions.payload.email;
      state.userInformation.userId = actions.payload.userId;
      state.userInformation.documentId = actions.payload.documentId;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setModeToRedux, setLoginInitialStates } = globalSlice.actions;

export default globalSlice.reducer;
