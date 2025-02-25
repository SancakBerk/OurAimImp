import { JSX } from "react";
export type verticalNavbarType = {
  id: number;
  title: string;
  icon: JSX.Element;
  contentComponent: JSX.Element;
};
export type verticalNavbarProps = {
  visible: boolean;
};
export type perSavingsType = {
  type: string;
  price: number;
  date: number;
};
export type barChartDataType = {
  data: number[];
  label: string;
};
export type expensesType = {
  price: number;
  amount: number;
  userId: string;
  imageUrl: string;
  isRequired: boolean;
  name: string;
  rate: number;
  isCalculating: boolean;
};
export type expensesDataWithDocumentId = expensesType & {
  documentId: string;
};

export type totalSavingsType = {
  totalSavings: totalSavingsObjectType;
  aimDate: number;
  userId: string;
};

export type totalSavingsObjectType = {
  dollar: number;
  euro: number;
  fon: number;
  gold14: number;
  gold18: number;
  gold22: number;
  gold24: number;
  hisse: number;
  tl: number;
};
export type totalSavingTypeWithDocumentId = totalSavingsType & {
  documentId: string;
};

export type userType = {
  email: string;
  password: string;
  userId: string;
};
export type userTypeWithDocumentId = userType & {
  documentId: string;
};

export type serviceReturnType = {
  statusCode: number;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
};

export type exchangeDataEachObjectType = {
  Alış: number;
  Tür: string;
  Satış: number;
  Değişim: string;
};
export type exchangeDataEachObjectResponseType = {
  Alış: string;
  Tür: string;
  Satış: string;
  Değişim: string;
};
export type exchangeDataResponseType = {
  dollar: exchangeDataEachObjectResponseType;
  euro: exchangeDataEachObjectResponseType;
  gold14: exchangeDataEachObjectResponseType;
  gold18: exchangeDataEachObjectResponseType;
  gold22: exchangeDataEachObjectResponseType;
  gold24: exchangeDataEachObjectResponseType;
};
export type exchangeDataType = {
  dollar: exchangeDataEachObjectType;
  euro: exchangeDataEachObjectType;
  gold14: exchangeDataEachObjectType;
  gold18: exchangeDataEachObjectType;
  gold22: exchangeDataEachObjectType;
  gold24: exchangeDataEachObjectType;
};

export type calculateSpendingAndAimInformationDataType = {
  aimDate: Date;
  howManyDaysLeft: number;
  requestedExpensePrice: number;
  requeiredExpensePrice: number;
  totalExpensePrice: number;
  monthlyNeededMoney: number;
};

export type localStorageSessionType = {
  userId: string;
  systemEnterDate: number;
  systemExpiresDate: number;
  rememberMe: boolean;
};

export type pieCharDataType = {
  id: number;
  value: number;
  label: string;
};

export type savingComponentTextType = {
  type: string;
  placeholder: string;
  afterText: string;
};

export type globalDialogEachButtonType = {
  text: string;
  onClick: () => void;
};
