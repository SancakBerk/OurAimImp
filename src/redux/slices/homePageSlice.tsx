import {
  exchangeDataType,
  expensesDataWithDocumentId,
  totalSavingTypeWithDocumentId,
} from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

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
  totalSavingData: totalSavingTypeWithDocumentId;
  isPopupOpen: isPopupOpenType;
  deletePopUpConfirmation: isDeleteConfirmPopUpType;
  expenseDataChanged: boolean;
  currentExpenseData: expensesDataWithDocumentId[];
  currentExchangeRates: exchangeDataType;
  totalSavingsDataChanged: boolean;
}

const initialState: InitialStateTypes = {
  totalSavingData: {
    aimDate: 0,
    documentId: "",
    totalSavings: {
      dollar: 0,
      euro: 0,
      gold14: 0,
      gold18: 0,
      gold22: 0,
      gold24: 0,
      fon: 0,
      tl: 0,
      hisse: 0,
    },
    userId: "",
  },
  currentExchangeRates: {
    dollar: { Alış: 1, Tür: "USD", Satış: 1, Değişim: "1" },
    euro: { Alış: 1, Tür: "EUR", Satış: 1, Değişim: "1" },
    gold14: { Alış: 1, Tür: "14-ayar-altin", Satış: 1, Değişim: "1" },
    gold18: { Alış: 1, Tür: "18-ayar-altin", Satış: 1, Değişim: "1" },
    gold22: { Alış: 1, Tür: "gram-altin", Satış: 1, Değişim: "1" },
    gold24: { Alış: 1, Tür: "gram-has-altin", Satış: 1, Değişim: "1" },
  },
  isPopupOpen: { isPopupOpen: false, isUpdate: false },
  deletePopUpConfirmation: {
    showDeletePopUp: false,
  },
  expenseDataChanged: false,
  currentExpenseData: [],
  totalSavingsDataChanged: false,
};

export const homePageSlice = createSlice({
  name: "homePageSlice",
  initialState,
  reducers: {
    setTotalSavingData: (
      state,
      action: PayloadAction<totalSavingTypeWithDocumentId>
    ) => {
      state.totalSavingData = action.payload;
    },
    setTotalSavingsDataChanged: (state, action: PayloadAction<boolean>) => {
      state.totalSavingsDataChanged = action.payload;
    },
    setCurrentExchangeRates: (
      state,
      action: PayloadAction<exchangeDataType>
    ) => {
      state.currentExchangeRates = action.payload;
    },
    setCurrentExpenseData: (
      state,
      actions: PayloadAction<expensesDataWithDocumentId[]>
    ) => {
      state.currentExpenseData = actions.payload;
    },
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
  setCurrentExchangeRates,
  setCurrentExpenseData,
  setTotalSavingData,
  setTotalSavingsDataChanged,
} = homePageSlice.actions;

export default homePageSlice.reducer;
