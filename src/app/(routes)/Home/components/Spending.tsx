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
  useEffect(() => {
    const newObj = calculateSpendingAndAimInformationData();

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
      className={`w-full h-full border bg-opacity-40 dark:bg-opacity-40 backdrop-blur-3xl bg-gray-400  dark:bg-black  flex flex-col dark:text-white relative max-xl:text-sm  `}
    >
      <div className="w-full h-[20%] flex justify-center items-center flex-col border-b-4  ">
        <ButtonComponent
          onClick={() => {
            setShowPopUpUpdateAımDate(true);
          }}
          className="text-lg"
        >
          <h1 className="  text-6xl max-xl:text-2xl  max-sm:text-xl">
            Hedef Tarih:{" "}
            {CalculatedSavingInformations?.aimDate.getDate().toString()} {" / "}
            {CalculatedSavingInformations?.aimDate.getMonth().toString()}
            {" / "}
            {CalculatedSavingInformations?.aimDate.getFullYear().toString()}
          </h1>
        </ButtonComponent>
      </div>

      <div className="w-full h-[80%] flex gap-5 ">
        <div className=" w-[50%] h-full flex flex-col gap-8 dark:text-white p-10 text-2xl  max-sm:p-2 ">
          <div className="flex gap-x-5 w-full  max-xl:text-base max-xl:gap-x-2 max-sm:text-xs  max-sm:flex-col ">
            <h1 className="w-[60%] text-center max-sm:w-full ">
              Gerekli Ürünlerin Ücreti:
            </h1>
            <h2 className="w-[40%] text-end max-sm:text-center max-sm:w-full ">
              {changeNumberToThreeDigitsAndReturn(
                CalculatedSavingInformations.requeiredExpensePrice
              )}{" "}
              TL
            </h2>
          </div>
          <div className="flex gap-x-5 max-xl:text-base max-xl:gap-x-2 max-sm:text-xs   max-sm:flex-col">
            <h1 className="w-[60%] text-center max-sm:w-full ">
              İstek Ürünlerin Ücreti:
            </h1>
            <h2 className="w-[40%] text-end max-sm:text-center max-sm:w-full ">
              {changeNumberToThreeDigitsAndReturn(
                CalculatedSavingInformations.requestedExpensePrice
              )}{" "}
              TL
            </h2>
          </div>
          <hr />
          <div className="flex gap-x-5 font-bold max-xl:text-base max-xl:gap-x-2 max-sm:text-xs   max-sm:flex-col">
            <h1 className="w-[60%] text-center max-sm:w-full ">
              Tüm Ürünlerin Ücreti:
            </h1>
            <h2 className="w-[40%] text-end max-sm:text-center max-sm:w-full ">
              {changeNumberToThreeDigitsAndReturn(
                CalculatedSavingInformations?.totalExpensePrice
              )}{" "}
              TL
            </h2>
          </div>

          <div className="flex gap-x-5 font-bold max-xl:text-base max-xl:gap-x-2 max-sm:text-xs   max-sm:flex-col ">
            <h1 className="w-[60%] text-center max-sm:w-full ">
              Biriktirilen Para:
            </h1>
            <h2 className="w-[40%] text-end max-sm:text-center max-sm:w-full ">
              {changeNumberToThreeDigitsAndReturn(
                calculateTotalSavingsAsTlRateAndReturnNumber(homePageSlice)
              )}
              TL
            </h2>
          </div>

          <div className="flex gap-x-5 font-bold max-xl:text-base max-xl:gap-x-2 max-sm:text-xs   max-sm:flex-col">
            {CalculatedSavingInformations.monthlyNeededMoney > 0 ? (
              <h1 className="text-blue-500 w-[60%] max-sm:w-full text-center ">
                Aylık Gereken Para:
              </h1>
            ) : (
              <h1 className="text-green-500  w-[60%] max-sm:w-full text-center ">
                Aylık Fazla Para:
              </h1>
            )}
            <h2 className="w-[40%] text-end max-sm:text-center max-sm:w-full ">
              {changeNumberToThreeDigitsAndReturn(
                Math.abs(CalculatedSavingInformations.monthlyNeededMoney)
              )}{" "}
              TL
            </h2>
          </div>
          <div className="w-full flex ">
            <ProgressBar
              height="30px"
              className="w-full  "
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
