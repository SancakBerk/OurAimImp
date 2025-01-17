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
  amount: number;
  imageUrl: string;
  isRequired: boolean;
  name: string;
  rate: number;
  userId: string;
};

export type savingsType = {
  amount: number;
  date: Date;
  type: string;
  userId: string;
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
