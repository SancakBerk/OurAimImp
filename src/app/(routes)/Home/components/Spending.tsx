import { calculateSpendingAndAimInformationDataType } from "@/types/types";
import React, { JSX, useEffect, useState } from "react";
import { ButtonComponent } from "@/components/ButtonComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  getDaysBetweenDates,
  getFloatValueAsFixed2,
} from "@/utils/helperFunctions";
import { FaRegEdit } from "react-icons/fa";

const Spending = (): JSX.Element => {
  const homePageSlice = useSelector((state: RootState) => state.homePageSlice);
  const globalSlice = useSelector((state: RootState) => state.globalSlice);
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
  return (
    <div
      className={`w-full h-full border bg-[rgb(255,255,250)] dark:bg-darkBackground flex flex-col dark:text-white `}
    >
      <div className="w-full h-[40%] flex justify-center items-center relative  border-b-4">
        <div className="absolute right-[10%] top-[10%] flex justify-center items-center ">
          <ButtonComponent>
            <FaRegEdit />
          </ButtonComponent>
        </div>
        <h1>
          {" "}
          Hedef Tarih:{" "}
          {CalculatedSavingInformations?.aimDate.getDate().toString()} {" / "}
          {CalculatedSavingInformations?.aimDate.getMonth().toString()}
          {" / "}
          {CalculatedSavingInformations?.aimDate.getFullYear().toString()}
        </h1>
      </div>

      <div className=" w-[50%] h-full flex flex-col gap-8 dark:text-white ">
        <table>
          <tr>
            <td className=" tex-tcenter"> Zorunlu Ürünlerin Ücreti </td>
            <td>{CalculatedSavingInformations?.requeiredExpensePrice} TL</td>
          </tr>

          <tr>
            <td>İstek Ürünlerin Ücreti</td>
            <td>{CalculatedSavingInformations?.requestedExpensePrice} TL</td>
          </tr>
          <tr>
            <td>Toplam Ürünlerin Ücreti</td>
            <td>{CalculatedSavingInformations?.totalExpensePrice} TL</td>
          </tr>
        </table>
      </div>
      <div className=" w-[50%] h-full"></div>
    </div>
  );
};
export default Spending;
