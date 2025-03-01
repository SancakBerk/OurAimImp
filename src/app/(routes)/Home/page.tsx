"use client";
import {
  getIsDarkMode,
  isSessionExpired,
  removeNumberCommasAndDotThenReturnNumber,
  sortObjectAlphabetically,
} from "@/utils/helperFunctions";
import { JSX, useEffect } from "react";
import VerticalNavbar from "./components/VerticalNavbar";
import Expenses from "./components/Expenses";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import UpdateAddPopUp from "./components/UpdateAddPopUp";
import ConfirmDeletePopUp from "./components/ConfirmDeletePopUp";
import { setModeToRedux, setUserIdToRedux } from "@/redux/slices/globalSlice";
import {
  exchangeDataResponseType,
  exchangeDataType,
  expensesDataWithDocumentId,
  localStorageSessionType,
  serviceReturnType,
  totalSavingsObjectType,
  totalSavingTypeWithDocumentId,
} from "@/types/types";
import { getUserExpensesByUserId } from "@/services/expensesService";
import {
  setCurrentExchangeRates,
  setCurrentExpenseData,
  setTotalSavingData,
  setTotalSavingsDataChanged,
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

  const getTotalSavingDataByIdRequest = () => {
    getTotalSavingDataById(globalSlice.userId).then(
      (res: serviceReturnType) => {
        if (res.statusCode === 200 && res.data && res.data[0]) {
          const data = res.data[0] as totalSavingTypeWithDocumentId;
          const sorted = sortObjectAlphabetically(data.totalSavings);
          const obj: totalSavingTypeWithDocumentId = {
            aimDate: data.aimDate,
            userId: data.userId,
            documentId: data.documentId,
            totalSavings: sorted as totalSavingsObjectType,
          };

          dispatch(setTotalSavingData(obj as totalSavingTypeWithDocumentId));
          dispatch(setTotalSavingsDataChanged(false));
        }
      }
    );
  };
  const savingComponentRequests = () => {
    if (globalSlice.userId) {
      getCurrentExchangeRates().then((res: serviceReturnType) => {
        if (res.statusCode === 200) {
          const object: exchangeDataResponseType = {
            dollar: res.data?.USD,
            gold14: res.data?.["14-ayar-altin"],
            euro: res.data?.EUR,
            gold18: res.data?.["18-ayar-altin"],
            gold22: res.data?.["gram-altin"],
            gold24: res.data?.["gram-has-altin"],
          };
          const newData: exchangeDataType = {
            dollar: { Alış: 0, Satış: 0, Tür: "Dolar", Değişim: "" },
            gold14: { Alış: 0, Satış: 0, Tür: "Altın", Değişim: "" },
            euro: { Alış: 0, Satış: 0, Tür: "Euro", Değişim: "" },
            gold18: { Alış: 0, Satış: 0, Tür: "Altın", Değişim: "" },
            gold22: { Alış: 0, Satış: 0, Tür: "Altın", Değişim: "" },
            gold24: { Alış: 0, Satış: 0, Tür: "Altın", Değişim: "" },
          };
          for (const key in object) {
            const typedKey = key as keyof exchangeDataType;
            const { Alış, Satış, Tür, ...rest } =
              object[typedKey as keyof exchangeDataResponseType];
            if (!(Tür == "Altın")) {
              newData[typedKey] = {
                ...rest,
                Tür: Tür,
                Alış: removeNumberCommasAndDotThenReturnNumber(Alış),
                Satış: removeNumberCommasAndDotThenReturnNumber(Satış),
              };
            } else {
              newData[typedKey] = {
                ...rest,
                Tür: Tür,
                Alış: parseFloat(Alış.replace(".", "")),
                Satış: parseFloat(Alış.replace(".", "")),
              };
            }
          }

          dispatch(setCurrentExchangeRates(newData));
        }
      });
    }
  };
  useEffect(() => {
    if (!isSessionExpired()) {
      const localStorageData = localStorage.getItem("session");
      const session = JSON.parse(localStorageData!) as localStorageSessionType;
      dispatch(setUserIdToRedux(session.userId));
    }
    if (getIsDarkMode()) {
      dispatch(setModeToRedux(true));
    }
    getExpenses();
    savingComponentRequests();
    getTotalSavingDataByIdRequest();
  }, []);
  useEffect(() => {
    if (homePageSlice.totalSavingsDataChanged) {
      getTotalSavingDataByIdRequest();
    }
  }, [homePageSlice.totalSavingsDataChanged]);

  useEffect(() => {
    getExpenses();
    savingComponentRequests();
    getTotalSavingDataByIdRequest();
  }, [globalSlice.userId, homePageSlice.expenseDataChanged]);

  return (
    <div className={`${isDarkMode && "dark"}`}>
      <div
        className={`w-screen h-screen flex relative  ${
          isDarkMode ? "bg-DarkModeImage" : "bg-LightModeImage"
        }`}
      >
        <div className="w-[10%] h-full fixed top-0 left-0 bottom-0 z-50">
          <VerticalNavbar />
        </div>
        <div className=" w-[100%] h-screen">
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
