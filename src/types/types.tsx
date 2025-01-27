import { JSX } from "react";
import { IconType } from "react-icons";
export type verticalNavbarType = {
  id: number;
  title: string;
  icon: JSX.Element;
  contentComponent: JSX.Element;
};
export type verticalNavbarProps = {
  visible: boolean;
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
  aimDate: Date;
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
  userAimDate: Date;
  userId: string;
};
export type userTypeWithDocumentId = userType & {
  documentId: string;
};

export type serviceReturnType = {
  statusCode: number;
  message: string;
  data?: any;
};

export type exchangeDataEachObjectType = {
  Alış: string;
  Tür: string;
  Satış: string;
  Değişim: string;
};
export type exchangeDataType = {
  dollar: exchangeDataEachObjectType;
  euro: exchangeDataEachObjectType;
  gold14: exchangeDataEachObjectType;
  gold18: exchangeDataEachObjectType;
  gold22: exchangeDataEachObjectType;
  gold24: exchangeDataEachObjectType;
};

export type calculateSavingDataType = {
  aimDate: Date;
  howManyDaysLeft: number;
  requiredSavingsPrice: number;
  requestedSavingsPrice: number;
  totalSavingMoney: number;
  monthlyNeededMoney: number;
};

export type localStorageSessionType = {
  userId: string;
  systemEnterDate: Date;
  systemExpiresDate: Date;
  rememberMe: boolean;
};
