import { verticalNavbarProps } from "@/types/types";
import React, { JSX } from "react";
import { ButtonComponent } from "@/components/ButtonComponent";

const Spending = (): JSX.Element => {
  //   useEffect(() => {
  //   if (
  //     homePageSlice.currentExchangeRates &&
  //     homePageSlice.currentExpenseData
  //   ) {
  //     var calculateSavingDataVar = calculateSavingData();
  //     if (calculateSavingDataVar) {
  //       setCalculatedSavingInformations(calculateSavingDataVar);
  //     }
  //   }
  // }, [homePageSlice.currentExchangeRates, homePageSlice.currentExpenseData]);
  // const calculateSavingData = (): calculateSavingDataType | null => {
  //   if (savingsData) {
  //     var currentExpenseData = homePageSlice.currentExpenseData;
  //     var totalRequestedDataCosts = 0;
  //     var totalRequiredDataCosts = 0;
  //     currentExpenseData.map((eachExpenseData) => {
  //       if (eachExpenseData.isCalculating) {
  //         var exchangeDataToTl =
  //           eachExpenseData.price *
  //           parseInt(exchangeDatas.dollar.Alış) *
  //           eachExpenseData.amount;
  //         if (eachExpenseData.isRequired && exchangeDatas) {
  //           totalRequiredDataCosts += exchangeDataToTl;
  //         } else {
  //           totalRequestedDataCosts += exchangeDataToTl;
  //         }
  //       }
  //     });
  //     var howManyDaysLeft = getDaysBetweenDates(
  //       new Date(),
  //       savingsData.aimDate instanceof Timestamp
  //         ? savingsData.aimDate.toDate()
  //         : new Date(savingsData.aimDate)
  //     );

  //     return {
  //       aimDate: savingsData.aimDate,
  //       howManyDaysLeft: howManyDaysLeft,
  //       requestedSavingsPrice: totalRequestedDataCosts,
  //       requiredSavingsPrice: totalRequiredDataCosts,
  //       totalSavingMoney: totalRequestedDataCosts + totalRequiredDataCosts,
  //       monthlyNeededMoney:
  //         (totalRequestedDataCosts + totalRequiredDataCosts) /
  //         (howManyDaysLeft / 30),
  //     };
  //   }
  //   return null;
  // };
  return (
    <div className={`w-full h-full bg-blue-400  `}>
      <ButtonComponent text="Test" onClick={() => {}} />
    </div>
  );
};
export default Spending;
