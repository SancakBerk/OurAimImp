import {
  calculateSpendingAndAimInformationDataType,
  verticalNavbarProps,
} from "@/types/types";
import React, { JSX, useEffect, useState } from "react";
import { ButtonComponent } from "@/components/ButtonComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  getDaysBetweenDates,
  removeNumberCommasAndDotThenReturnNumber,
} from "@/utils/helperFunctions";
import { FaRegEdit } from "react-icons/fa";

const Spending = (): JSX.Element => {
  const homePageSlice = useSelector((state: RootState) => state.homePageSlice);
  const globalSlice = useSelector((state: RootState) => state.globalSlice);
  const [calculatedSavingInformations, setCalculatedSavingInformations] =
    useState<calculateSpendingAndAimInformationDataType>();
  useEffect(() => {
    calculateSpendingAndAimInformationData();
  }, [globalSlice.userId]);

  useEffect(() => {
    var calculateSavingDataVar = calculateSpendingAndAimInformationData();
    if (calculateSavingDataVar) {
      setCalculatedSavingInformations(calculateSavingDataVar);
    }
  }, [homePageSlice.currentExchangeRates, homePageSlice.currentExpenseData]);
  const calculateSpendingAndAimInformationData =
    (): calculateSpendingAndAimInformationDataType => {
      var currentExpenseData = homePageSlice.currentExpenseData;
      var totalRequestedDataCosts = 0;
      var totalRequiredDataCosts = 0;
      currentExpenseData.map((eachExpenseData) => {
        if (eachExpenseData.isCalculating) {
          var exchangeDataToTl =
            eachExpenseData.price *
            removeNumberCommasAndDotThenReturnNumber(
              homePageSlice.currentExchangeRates.dollar.Alış
            ) *
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
      var howManyDaysLeft = getDaysBetweenDates(
        new Date().getTime(),
        homePageSlice.totalSavingData.aimDate
      );

      return {
        aimDate: homePageSlice.totalSavingData.aimDate,
        howManyDaysLeft: howManyDaysLeft,
        requestedSavingsPrice: totalRequestedDataCosts,
        requiredSavingsPrice: totalRequiredDataCosts,
        totalSavingMoney: totalRequestedDataCosts + totalRequiredDataCosts,
        monthlyNeededMoney:
          (totalRequestedDataCosts + totalRequiredDataCosts) /
          (howManyDaysLeft / 30),
      };
    };
  return (
    <div className={`w-full h-full border flex flex-col `}>
      <div className="w-full h-[40%] flex justify-center items-center relative  border-b-4">
        <div className="absolute right-[10%] top-[10%] flex justify-center items-center ">
          <ButtonComponent>
            <FaRegEdit />
          </ButtonComponent>
        </div>
        <h1> Hedef Tarih: </h1>
      </div>

      <div className=" w-[50%] h-full flex flex-col gap-8">
        <div className="w-full p-4 h-auto flex  ml-10 justify-center  ">
          <h1> Hesaplanılması istenilen ürün bilgileri </h1>
        </div>
        <div className="w-full p-4 h-auto flex  ml-10 ">
          <h1> İhtiyaç ürünlerin toplam ücreti: </h1>
        </div>
        <div className="w-full p-4 h-auto flex  ml-10 ">
          <h1> İstek ürünlerin toplam ücreti: </h1>
        </div>
        <div className="w-full p-4 h-auto flex  ml-10 ">
          <h1> Tüm ürünlerin ücreti: </h1>
        </div>
      </div>
      <div className=" w-[50%] h-full"></div>
    </div>
  );
};
export default Spending;
