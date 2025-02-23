import { calculateSpendingAndAimInformationDataType } from "@/types/types";
import React, { JSX, useEffect, useState } from "react";
import { ButtonComponent } from "@/components/ButtonComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  calculateTotalSavingsAsTlRateAndReturnNumber,
  getDaysBetweenDates,
  getFloatValueAsFixed2,
} from "@/utils/helperFunctions";
import ProgressBar from "@ramonak/react-progress-bar";
import GlobalDialog from "@/components/GlobalDialog";

const Spending = (): JSX.Element => {
  const homePageSlice = useSelector((state: RootState) => state.homePageSlice);
  const globalSlice = useSelector((state: RootState) => state.globalSlice);
  const [updateAimDateValue, setupdateAimDateValue] = useState("");
  const [showPopUpUpdateAımDate, setShowPopUpUpdateAımDate] =
    useState<boolean>(false);
  const [CalculatedSavingInformations, setCalculatedSavingInformations] =
    useState<calculateSpendingAndAimInformationDataType>();
  useEffect(() => {
    console.log(
      "calculateSpendingAndAimInformationData();",
      calculateSpendingAndAimInformationData()
    );
  }, [globalSlice.userId]);

  useEffect(() => {
    const calculateSavingDataVar = calculateSpendingAndAimInformationData();
    if (calculateSavingDataVar) {
      console.log("settingg", calculateSavingDataVar);
      setCalculatedSavingInformations(calculateSavingDataVar);
    }
  }, [homePageSlice.currentExchangeRates, homePageSlice.currentExpenseData]);
  const calculateSpendingAndAimInformationData =
    (): calculateSpendingAndAimInformationDataType => {
      const currentExpenseData = homePageSlice.currentExpenseData;
      let totalRequestedDataCosts = 0;
      let totalRequiredDataCosts = 0;
      console.log("cureentExpenseData", currentExpenseData);
      console.log(
        "homePageSlice.currentExchangeRates",
        homePageSlice.currentExchangeRates
      );
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
      console.log(
        "homePageSlice.totalSavingData.aimDate",
        homePageSlice.totalSavingData
      );
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
          (totalRequestedDataCosts + totalRequiredDataCosts) /
            (howManyDaysLeft / 30)
        ),
      };
    };
  if (!CalculatedSavingInformations) {
    return <span className="loader"></span>;
  }
  return (
    <div
      className={`w-full h-full border bg-white dark:bg-darkBackground flex flex-col dark:text-white `}
    >
      <div className="w-full h-[40%] flex justify-center items-center    flex-col">
        <ButtonComponent
          onClick={() => {
            // setShowPopUpUpdateAımDate(true);
          }}
          className="text-lg"
        >
          Hedef Tarih:{" "}
          <h1 className="text-6xl">
            {" "}
            {CalculatedSavingInformations?.aimDate.getDate().toString()} {" / "}
            {CalculatedSavingInformations?.aimDate.getMonth().toString()}
            {" / "}
            {CalculatedSavingInformations?.aimDate.getFullYear().toString()}
          </h1>
        </ButtonComponent>
      </div>

      <div className=" w-[50%] h-full flex flex-col gap-8 dark:text-white p-10 text-2xl ">
        <div className="flex gap-x-5">
          <h1>Gerekli Ürünlerin Ücreti:</h1>
          <h2>{CalculatedSavingInformations.requeiredExpensePrice} TL</h2>
        </div>
        <div className="flex gap-x-5">
          <h1>İstek Ürünlerin Ücreti:</h1>
          <h2>{CalculatedSavingInformations.requestedExpensePrice} TL</h2>
        </div>
        <div className="flex gap-x-5 font-bold">
          <h1>Tüm Ürünlerin Ücreti:</h1>
          <h2>{CalculatedSavingInformations?.totalExpensePrice} TL</h2>
        </div>
        <div className="w-full flex ">
          <ProgressBar
            className="w-[50%]  "
            completed={(
              (calculateTotalSavingsAsTlRateAndReturnNumber(homePageSlice) /
                CalculatedSavingInformations.totalExpensePrice) *
              100
            ).toFixed(2)}
          />
        </div>
      </div>
      <div className=" w-[50%] h-full"></div>
      {showPopUpUpdateAımDate && (
        <GlobalDialog title="Hedef Tarihi Güncelle">
          <input
            type="date"
            value={updateAimDateValue}
            onChange={(e) => {
              setupdateAimDateValue(e.target.value);
            }}
          />
          <ButtonComponent
            onClick={() => {
              setShowPopUpUpdateAımDate(false);
            }}
            text="Güncelle"
          />
        </GlobalDialog>
      )}
    </div>
  );
};
export default Spending;
