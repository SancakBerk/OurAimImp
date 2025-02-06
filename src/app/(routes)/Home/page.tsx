"use client";
import {
  getIsDarkMode,
  isSessionExpired,
  removeNumberCommasAndDotThenReturnNumber,
} from "@/utils/helperFunctions";
import { JSX, ReactNode, useEffect, useState } from "react";
import VerticalNavbar from "./components/VerticalNavbar";
import Expenses from "./components/Expenses";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import UpdateAddPopUp from "./components/UpdateAddPopUp";
import ConfirmDeletePopUp from "./components/ConfirmDeletePopUp";
import { setModeToRedux, setUserIdToRedux } from "@/redux/slices/globalSlice";
import {
  exchangeDataType,
  expensesDataWithDocumentId,
  localStorageSessionType,
  serviceReturnType,
} from "@/types/types";
import { getUserExpensesByUserId } from "@/services/expensesService";
import {
  setCurrentExchangeRates,
  setCurrentExpenseData,
} from "@/redux/slices/homePageSlice";
import { getCurrentExchangeRates } from "@/services/globalService";
import { getTotalSavingDataById } from "@/services/savingService";

const HomePage = (): JSX.Element => {
  const homePageSlice = useSelector((state: RootState) => state.homePageSlice);
  const globalSlice = useSelector((state: RootState) => state.globalSlice);
  const isDarkMode = useSelector(
    (state: RootState) => state.globalSlice.isDarkMode
  );
  const dispatch = useDispatch();

  const getExpenses = async () => {
    await getUserExpensesByUserId(globalSlice.userId).then(
      (data: serviceReturnType) => {
        if (data.statusCode == 200) {
          dispatch(
            setCurrentExpenseData(data.data as expensesDataWithDocumentId[])
          );
        }
      }
    );
  };

  const savingComponentRequests = () => {
    if (globalSlice.userId) {
      getCurrentExchangeRates().then((res: serviceReturnType) => {
        if (res.statusCode === 200) {
          var object: exchangeDataType = {
            dollar: res.data?.USD,
            gold14: res.data?.["14-ayar-altin"],
            euro: res.data?.EUR,
            gold18: res.data?.["18-ayar-altin"],
            gold22: res.data?.["gram-altin"],
            gold24: res.data?.["gram-has-altin"],
          };
          var removedCommaObject = Object.entries(object).map(
            ([exchangeKey, value]) => {
              var newValue = Object.entries(value).map(([key, value]) => {
                var removeddata =
                  removeNumberCommasAndDotThenReturnNumber(value) ?? 1;
                return { [key]: removeddata };
              });
              return { [exchangeKey]: newValue };
            }
          );
          dispatch(setCurrentExchangeRates(object));
        }
      });
    }
  };
  useEffect(() => {
    if (!isSessionExpired()) {
      var localStorageData = localStorage.getItem("session");
      var session = JSON.parse(localStorageData!) as localStorageSessionType;
      dispatch(setUserIdToRedux(session.userId));
    }
    if (getIsDarkMode()) {
      dispatch(setModeToRedux(true));
    }
    getExpenses();
    savingComponentRequests();
  }, []);

  useEffect(() => {
    getExpenses();
    savingComponentRequests();
  }, [globalSlice.userId]);

  return (
    <div className={`${isDarkMode && "dark"}`}>
      <div className="w-screen h-screen flex relative">
        <div className="w-[10%] h-full">
          <VerticalNavbar />
        </div>
        <div className="w-full h-screen">
          <Expenses />
        </div>
        {homePageSlice.isPopupOpen.isPopupOpen && <UpdateAddPopUp />}
        {homePageSlice.deletePopUpConfirmation.showDeletePopUp && (
          <ConfirmDeletePopUp />
        )}
      </div>
    </div>
  );
};

export default HomePage;
