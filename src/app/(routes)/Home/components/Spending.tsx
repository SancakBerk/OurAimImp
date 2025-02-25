import {
  calculateSpendingAndAimInformationDataType,
  globalDialogEachButtonType,
  serviceReturnType,
} from "@/types/types";
import React, { JSX, useEffect, useState } from "react";
import { ButtonComponent } from "@/components/ButtonComponent";
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

const Spending = (): JSX.Element => {
  const homePageSlice = useSelector((state: RootState) => state.homePageSlice);
  const globalSlice = useSelector((state: RootState) => state.globalSlice);
  const [updateAimDateValue, setupdateAimDateValue] = useState<Dayjs | null>(
    null
  );
  const dispatch = useDispatch();

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
        }
      });
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
        (calculateTotalSavingsAsTlRateAndReturnNumber(homePageSlice) /
          CalculatedSavingInformations.totalExpensePrice) *
        100
      ).toFixed(2);
    } else {
      return "";
    }
  };
  useEffect(() => {
    const newObj = calculateSpendingAndAimInformationData();
    console.log(
      "veri değiştir function  calculateSpendingAndAimInformationData() worked again",
      newObj
    );
    setCalculatedSavingInformations(newObj);
  }, [
    homePageSlice.currentExchangeRates,
    homePageSlice.currentExpenseData,
    homePageSlice.totalSavingData,
  ]);
  const calculateSpendingAndAimInformationData =
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
    };

  if (!CalculatedSavingInformations) {
    return <span className="loader"></span>;
  }
  return (
    <div
      className={`w-full h-full border bg-white dark:bg-darkBackground flex flex-col dark:text-white relative `}
    >
      <div className="w-full h-[20%] flex justify-center items-center flex-col border-b-4 ">
        <ButtonComponent
          onClick={() => {
            setShowPopUpUpdateAımDate(true);
          }}
          className="text-lg"
        >
          <h1 className="text-6xl">
            Hedef Tarih:{" "}
            {CalculatedSavingInformations?.aimDate.getDate().toString()} {" / "}
            {CalculatedSavingInformations?.aimDate.getMonth().toString()}
            {" / "}
            {CalculatedSavingInformations?.aimDate.getFullYear().toString()}
          </h1>
        </ButtonComponent>
      </div>

      <div className="w-full h-[80%] flex gap-5 ">
        <div className=" w-[50%] h-full flex flex-col gap-8 dark:text-white p-10 text-2xl border ">
          <div className="flex gap-x-5">
            <h1>Gerekli Ürünlerin Ücreti:</h1>
            <h2>
              {changeNumberToThreeDigitsAndReturn(
                CalculatedSavingInformations.requeiredExpensePrice
              )}{" "}
              TL
            </h2>
          </div>
          <div className="flex gap-x-5">
            <h1>İstek Ürünlerin Ücreti:</h1>
            <h2>
              {changeNumberToThreeDigitsAndReturn(
                CalculatedSavingInformations.requestedExpensePrice
              )}{" "}
              TL
            </h2>
          </div>
          <div className="flex gap-x-5 font-bold">
            <h1>Tüm Ürünlerin Ücreti:</h1>
            <h2>
              {changeNumberToThreeDigitsAndReturn(
                CalculatedSavingInformations?.totalExpensePrice
              )}{" "}
              TL
            </h2>
          </div>
          <div className="flex gap-x-5 font-bold">
            <h1>Aylık Biriktirilmesi Gereken Miktar</h1>
            {changeNumberToThreeDigitsAndReturn(
              CalculatedSavingInformations.monthlyNeededMoney
            )}
            <h2> TL</h2>
          </div>
          <div className="w-full flex ">
            <ProgressBar
              className="w-[50%]  "
              completed={calculateProgressBarValue()}
            />
          </div>
        </div>
        <div className=" w-[50%] h-full"></div>
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
                  sx={{
                    width: "200px",
                  }}
                  slotProps={{
                    textField: {
                      sx: {
                        width: "200px",
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
