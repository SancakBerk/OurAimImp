import { redirect } from "next/navigation";
import {
  exchangeDataType,
  localStorageSessionType,
  pieCharDataType,
} from "@/types/types";

import { InitialStateTypes } from "@/redux/slices/homePageSlice";
import { savingRowInformations } from "./constants";

export const getIsDarkMode = (): boolean => {
  if (typeof window !== "undefined") {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    return isDarkMode ? true : false;
  }
  return false;
};

export const isSessionExpired = (): boolean => {
  const session = localStorage.getItem("session");
  if (session === null) return true;
  const sessionObj = JSON.parse(session) as localStorageSessionType;
  if (sessionObj.systemExpiresDate < new Date().getTime()) return true;
  return false;
};
export const redirectAuth = (): void => {
  redirect("/Homepage");
};

export const getFloatValueAsFixed2 = (number: number): number => {
  return parseFloat(number.toFixed(2));
};
export const getDaysBetweenTimestamps = (
  startDate: number,
  endDate: number
): number => {
  const difference = Math.abs(endDate - startDate);
  return Math.ceil(difference / (1000 * 60 * 60 * 24));
};

export const removeNumberCommasAndDotThenReturnNumber = (
  string: string
): number => {
  const number = parseFloat(string.replace(",", "."));
  return number;
};

export const sortObjectAlphabetically = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {} as Record<string, unknown>);
};

export const calculateSavingDataToTl = (
  key: string,
  homePageSlice: InitialStateTypes
): number => {
  if (
    homePageSlice.currentExchangeRates[key as keyof exchangeDataType] !=
    undefined
  ) {
    return homePageSlice.currentExchangeRates[key as keyof exchangeDataType]
      .Alış;
  } else {
    return 1;
  }
};

export const changeNumberToThreeDigitsAndReturn = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const calculateTotalSavingsAsTlRateAndReturnObjects = (
  homePageSlice: InitialStateTypes
): pieCharDataType[] => {
  const data = Object.entries(homePageSlice.totalSavingData.totalSavings).map(
    ([key, value], index) => {
      const exchangeRate =
        homePageSlice.currentExchangeRates[key as keyof exchangeDataType];
      const exchangeRateValue =
        exchangeRate && exchangeRate.Alış ? exchangeRate.Alış : 1;

      const label = savingRowInformations.find((each) => each.type === key);

      return {
        id: index,
        key: key,
        label: label != undefined ? label.placeholder : "key",
        value: value * exchangeRateValue,
      } as pieCharDataType;
    }
  );
  return data;
};

export const returnDescriotionFromKey = (key: string): string => {
  const label = savingRowInformations.find((each) => each.type === key);
  return label != undefined ? label.placeholder : "key";
};

export const getDaysBetweenDates = (
  firstDateTime: number,
  secondDateTime: number
): number => {
  const difference = Math.abs(firstDateTime - secondDateTime);
  return Math.ceil(difference / (1000 * 60 * 60 * 24));
};
export function isType<T>(data: unknown, type: T): boolean {
  return data !== null && typeof data === typeof type;
}
export const calculateTotalSavingsAsTlRateAndReturnNumber = (
  homePageSlice: InitialStateTypes
): number => {
  let total = 0;
  calculateTotalSavingsAsTlRateAndReturnObjects(homePageSlice).map(
    (each: pieCharDataType) => {
      total += each.value;
    }
  );
  return getFloatValueAsFixed2(total);
};
