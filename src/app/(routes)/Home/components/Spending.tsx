import {
  calculateSpendingAndAimInformationDataType,
  globalDialogEachButtonType,
  serviceReturnType,
} from "@/types/types";
import React, { JSX, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  calculateTotalSavingsAsTlRateAndReturnNumber,
  changeNumberToThreeDigitsAndReturn,
  getDaysBetweenDates,
  getFloatValueAsFixed2,
} from "@/utils/helperFunctions";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ProgressBar from "@ramonak/react-progress-bar";
import GlobalDialog from "@/components/GlobalDialog";
import { Dayjs } from "dayjs";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/utils/constants";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { updateAimDate } from "@/services/savingService";
import { setTotalSavingsDataChanged } from "@/redux/slices/homePageSlice";
import { useDragScroll } from "@/hooks/useDragScroll";

const Spending = (): JSX.Element => {
  const homePageSlice = useSelector((state: RootState) => state.homePageSlice);
  const globalSlice = useSelector((state: RootState) => state.globalSlice);
  const [updateAimDateValue, setupdateAimDateValue] = useState<Dayjs | null>(
    null
  );
  const dispatch = useDispatch();
  const scrollRef = useDragScroll();

  const [showPopUpUpdateAımDate, setShowPopUpUpdateAımDate] =
    useState<boolean>(false);
  const [CalculatedSavingInformations, setCalculatedSavingInformations] =
    useState<calculateSpendingAndAimInformationDataType>();
  const updateAimDateFunction = async () => {
    if (updateAimDateValue?.valueOf()) {
      await updateAimDate(
        globalSlice.userId,
        updateAimDateValue.valueOf()
      ).then((res: serviceReturnType) => {
        if (res.statusCode === 200) {
          dispatch(setTotalSavingsDataChanged(true));
          toast.success("Hedef tarihiniz başarıyla güncellendi!");
        } else {
          toast.error("Tarih güncellenirken bir hata oluştu.");
        }
      });
    } else {
      toast.warning("Lütfen bir tarih seçiniz.");
    }
  };
  const updateAimDateGlobalDialogButtons: globalDialogEachButtonType[] = [
    {
      text: "İptal",
      onClick: () => {
        setShowPopUpUpdateAımDate(false);
      },
    },
    {
      text: "Güncelle",
      onClick: () => {
        updateAimDateFunction();
        setShowPopUpUpdateAımDate(false);
      },
    },
  ];
  // useEffect(() => {
  //   calculateSpendingAndAimInformationData();
  // }, [globalSlice.userId]);

  const calculateProgressBarValue = (): string => {
    if (CalculatedSavingInformations) {
      return (
        (
          (calculateTotalSavingsAsTlRateAndReturnNumber(homePageSlice) /
            CalculatedSavingInformations.totalExpensePrice) *
          100
        ).toFixed(2) + "%"
      );
    } else {
      return "";
    }
  };
  const calculateSpendingAndAimInformationData = useCallback(
    (): calculateSpendingAndAimInformationDataType => {
      const currentExpenseData = homePageSlice.currentExpenseData;
      let totalRequestedDataCosts = 0;
      let totalRequiredDataCosts = 0;

      currentExpenseData.map((eachExpenseData) => {
        if (eachExpenseData.isCalculating) {
          const exchangeDataToTl =
            eachExpenseData.price *
            homePageSlice.currentExchangeRates.dollar.Alış *
            eachExpenseData.amount;
          if (
            eachExpenseData.isRequired &&
            homePageSlice.currentExchangeRates
          ) {
            totalRequiredDataCosts += exchangeDataToTl;
          } else {
            totalRequestedDataCosts += exchangeDataToTl;
          }
        }
      });
      const howManyDaysLeft = getDaysBetweenDates(
        new Date().getTime(),
        homePageSlice.totalSavingData.aimDate
      );

      return {
        aimDate: new Date(homePageSlice.totalSavingData.aimDate),
        howManyDaysLeft: howManyDaysLeft,
        requestedExpensePrice: getFloatValueAsFixed2(totalRequestedDataCosts),
        requeiredExpensePrice: getFloatValueAsFixed2(totalRequiredDataCosts),
        totalExpensePrice: getFloatValueAsFixed2(
          totalRequestedDataCosts + totalRequiredDataCosts
        ),
        monthlyNeededMoney: getFloatValueAsFixed2(
          (totalRequestedDataCosts +
            totalRequiredDataCosts -
            calculateTotalSavingsAsTlRateAndReturnNumber(homePageSlice)) /
            (howManyDaysLeft / 30)
        ),
      };
    },
    [homePageSlice]
  );

  useEffect(() => {
    const newObj = calculateSpendingAndAimInformationData();

    setCalculatedSavingInformations(newObj);
  }, [
    homePageSlice.currentExchangeRates,
    homePageSlice.currentExpenseData,
    homePageSlice.totalSavingData,
    calculateSpendingAndAimInformationData,
  ]);

  if (!CalculatedSavingInformations) {
    return <span className="loader"></span>;
  }
  return (
    <div className="w-full h-full glass-effect flex flex-col text-gray-900 dark:text-white">
      {/* Header Section */}
      <div className="w-full p-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            setShowPopUpUpdateAımDate(true);
          }}
          className="w-full group hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl p-4 transition-all"
        >
          <div className="flex items-center justify-center gap-3">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hedef Tarih
              </p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                {CalculatedSavingInformations?.aimDate.getDate()}{" / "}
                {CalculatedSavingInformations?.aimDate.getMonth() + 1}{" / "}
                {CalculatedSavingInformations?.aimDate.getFullYear()}
              </h1>
            </div>
          </div>
        </button>
      </div>

      {/* Content Section */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Required Items */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Gerekli Ürünler
                </h3>
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {changeNumberToThreeDigitsAndReturn(
                  CalculatedSavingInformations.requeiredExpensePrice
                )}{" "}
                TL
              </p>
            </div>

            {/* Wanted Items */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  İstek Ürünleri
                </h3>
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {changeNumberToThreeDigitsAndReturn(
                  CalculatedSavingInformations.requestedExpensePrice
                )}{" "}
                TL
              </p>
            </div>
          </div>

          {/* Total and Savings */}
          <div className="card p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-lg font-semibold">Toplam Hedef</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {changeNumberToThreeDigitsAndReturn(
                    CalculatedSavingInformations?.totalExpensePrice
                  )}{" "}
                  TL
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Biriktirilen</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {changeNumberToThreeDigitsAndReturn(
                    calculateTotalSavingsAsTlRateAndReturnNumber(homePageSlice)
                  )}{" "}
                  TL
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="card p-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  İlerleme
                </span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {calculateProgressBarValue()}
                </span>
              </div>
              <ProgressBar
                height="20px"
                className="w-full"
                completed={calculateProgressBarValue()}
                bgColor="#3b82f6"
                baseBgColor="#e5e7eb"
                labelClassName="hidden"
              />
            </div>
          </div>

          {/* Monthly Requirement */}
          <div
            className={`card p-6 ${
              CalculatedSavingInformations.monthlyNeededMoney > 0
                ? "bg-orange-50 dark:bg-orange-900/20"
                : "bg-green-50 dark:bg-green-900/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    CalculatedSavingInformations.monthlyNeededMoney > 0
                      ? "bg-orange-100 dark:bg-orange-900/40"
                      : "bg-green-100 dark:bg-green-900/40"
                  }`}
                >
                  <svg
                    className={`w-6 h-6 ${
                      CalculatedSavingInformations.monthlyNeededMoney > 0
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {CalculatedSavingInformations.monthlyNeededMoney > 0
                      ? "Aylık Gereken Para"
                      : "Aylık Fazla Para"}
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      CalculatedSavingInformations.monthlyNeededMoney > 0
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {changeNumberToThreeDigitsAndReturn(
                      Math.abs(CalculatedSavingInformations.monthlyNeededMoney)
                    )}{" "}
                    TL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPopUpUpdateAımDate && (
        <GlobalDialog
          buttons={updateAimDateGlobalDialogButtons}
          title="Hedef Tarihi Güncelle"
        >
          <div className="w-full h-full flex flex-col gap-5 justify-center item-center">
            <ThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Tarih Seç"
                  value={updateAimDateValue}
                  onChange={(newValue) => setupdateAimDateValue(newValue)}
                  slotProps={{
                    textField: {
                      sx: {
                        width: "full",
                        // Text rengi
                        "& .MuiInputBase-input": {
                          color: globalSlice.isDarkMode ? "#fff" : "#000",
                        },
                        // Label rengi
                        "& .MuiInputLabel-root": {
                          color: globalSlice.isDarkMode ? "#fff" : "#000",
                        },
                        // Border ve ikon rengi için outline stil ayarı
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: globalSlice.isDarkMode
                              ? "#fff"
                              : "#000",
                          },
                          "&:hover fieldset": {
                            borderColor: globalSlice.isDarkMode
                              ? "#fff"
                              : "#000",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: globalSlice.isDarkMode
                              ? "#fff"
                              : "#000",
                          },
                          // İkon rengi (örn. calendar ikonu)
                          "& svg": {
                            color: globalSlice.isDarkMode ? "#fff" : "#000",
                          },
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </ThemeProvider>
          </div>
        </GlobalDialog>
      )}
    </div>
  );
};
export default Spending;
