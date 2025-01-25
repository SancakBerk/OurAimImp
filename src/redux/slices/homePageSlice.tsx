import { expensesDataWithDocumentId, expensesType } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";
import type { Action, PayloadAction } from "@reduxjs/toolkit";

export interface isPopupOpenType {
  isPopupOpen: boolean;
  isUpdate: boolean;
  expenseData?: expensesDataWithDocumentId;
}
export interface isDeleteConfirmPopUpType {
  showDeletePopUp: boolean;
  deleteExpenseData?: expensesDataWithDocumentId;
}

export interface InitialStateTypes {
  isPopupOpen: isPopupOpenType;
  deletePopUpConfirmation: isDeleteConfirmPopUpType;
  expenseDataChanged: boolean;
}

const initialState: InitialStateTypes = {
  isPopupOpen: { isPopupOpen: false, isUpdate: false },
  deletePopUpConfirmation: {
    showDeletePopUp: false,
  },
  expenseDataChanged: false,
};

export const homePageSlice = createSlice({
  name: "homePageSlice",
  initialState,
  reducers: {
    setPopupOpen: (state, actions: PayloadAction<isPopupOpenType>) => {
      state.isPopupOpen.isPopupOpen = actions.payload.isPopupOpen;
      state.isPopupOpen.isUpdate = actions.payload.isUpdate;
      state.isPopupOpen.expenseData = actions.payload.expenseData;
    },
    setDeletePopUpConfirmation: (
      state,
      action: PayloadAction<isDeleteConfirmPopUpType>
    ) => {
      state.deletePopUpConfirmation.showDeletePopUp =
        action.payload.showDeletePopUp;
      state.deletePopUpConfirmation.deleteExpenseData =
        action.payload.deleteExpenseData;
    },
    setExpenseDataChanged: (state, action: PayloadAction<boolean>) => {
      state.expenseDataChanged = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setPopupOpen,
  setDeletePopUpConfirmation,
  setExpenseDataChanged,
} = homePageSlice.actions;

export default homePageSlice.reducer;
