import { RootState } from "@/redux/store";
import {
  calculateSavingDataType,
  exchangeDataType,
  expensesDataWithDocumentId,
  serviceReturnType,
  totalSavingsObjectType,
  totalSavingsType,
  totalSavingTypeWithDocumentId,
  verticalNavbarProps,
} from "@/types/types";
import React, { JSX, use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PieChart } from "@mui/x-charts/PieChart";
import {
  getTotalSavingDataById,
  UpdateTotalSavingsData,
} from "@/services/savingService";
import { getCurrentExchangeRates } from "@/services/globalService";
import { InputComponent } from "@/components/InputComponent";
import { ButtonComponent } from "@/components/ButtonComponent";
import { useFormik } from "formik";
import { addSavingsSchema } from "@/utils/loginInformationSchemas";
import { savingRowInformations } from "@/utils/constants";
import { setCurrentExchangeRates } from "@/redux/slices/homePageSlice";
export const SavingComponent = (): JSX.Element => {
  const globalSlice = useSelector((state: RootState) => state.globalSlice);
  const homePageSlice = useSelector((state: RootState) => state.homePageSlice);
  const [calculatedSavingInformations, setCalculatedSavingInformations] =
    useState<calculateSavingDataType>();

  const [exchangeDatas, setExchangeDatas] = useState<exchangeDataType>();
  const [savingsData, setSavingsData] =
    useState<totalSavingTypeWithDocumentId | null>(null);
  const [isTotalSavingProcessAdding, setIsTotalSavingProcessAdding] =
    useState(true);
  const dispatch = useDispatch();
  const useEffectStartFunctions = () => {
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
          setExchangeDatas(object);
          dispatch(setCurrentExchangeRates(object));
        }
      });
      getTotalSavingDataById(globalSlice.userId).then(
        (res: serviceReturnType) => {
          if (res.statusCode === 200 && res.data != undefined) {
            setSavingsData(
              (prev) => res.data[0] as totalSavingTypeWithDocumentId
            );
            var calculateSavingDataVar = calculateSavingData();
            if (calculateSavingDataVar) {
              setCalculatedSavingInformations(calculateSavingDataVar);
            }
          }
        }
      );
    }
  };

  useEffect(() => {
    useEffectStartFunctions();
  }, []);
  useEffect(() => {
    useEffectStartFunctions();
  }, [globalSlice.userId]);

  const calculateSavingData = (): calculateSavingDataType | null => {
    if (savingsData) {
      var currentExpenseData = homePageSlice.currentExpenseData;
      var totalRequestedDataCosts = 0;
      var totalRequiredDataCosts = 0;
      currentExpenseData.map((eachExpenseData) => {
        if (eachExpenseData.isCalculating) {
          var exchangeDataToTl =
            eachExpenseData.price *
            parseInt(exchangeDatas!.dollar.Alış) *
            eachExpenseData.amount;
          if (eachExpenseData.isRequired && exchangeDatas) {
            totalRequiredDataCosts += exchangeDataToTl;
          } else {
            totalRequestedDataCosts += exchangeDataToTl;
          }
        }
      });

      var howManyDaysLeft =
        savingsData.aimDate.getTime() - new Date().getTime();
      return {
        aimDate: savingsData.aimDate,
        howManyDaysLeft: howManyDaysLeft,
        requestedSavingsPrice: totalRequestedDataCosts,
        requiredSavingsPrice: totalRequiredDataCosts,
        totalSavingMoney: totalRequestedDataCosts + totalRequiredDataCosts,
        monthlyNeededMoney:
          (totalRequestedDataCosts + totalRequiredDataCosts) /
          (howManyDaysLeft / 30),
      };
    }
    return null;
  };

  const clearValues = () => {
    values.gold14 = 0;
    values.gold18 = 0;
    values.gold22 = 0;
    values.gold24 = 0;
    values.dollar = 0;
    values.euro = 0;
    values.fon = 0;
    values.tl = 0;
    values.hisse = 0;
  };
  const { handleChange, handleSubmit, errors, values } = useFormik({
    initialValues: {
      gold14: 0,
      gold18: 0,
      gold22: 0,
      gold24: 0,
      dollar: 0,
      euro: 0,
      fon: 0,
      tl: 0,
      hisse: 0,
    },
    validationSchema: addSavingsSchema,
    onSubmit: async () => {
      if (!savingsData) {
        return;
      }
      var object: totalSavingsType = {
        aimDate: savingsData?.aimDate,
        userId: savingsData?.userId,
        totalSavings: savingsData.totalSavings as totalSavingsObjectType,
      };
      Object.entries(values).map(([key, value]) => {
        if (value != 0) {
          {
            isTotalSavingProcessAdding
              ? (object.totalSavings[key as keyof totalSavingsObjectType] +=
                  value)
              : (object.totalSavings[key as keyof totalSavingsObjectType] -=
                  value);
          }
        }
      });
      await UpdateTotalSavingsData(savingsData.documentId, object).then(
        (res: serviceReturnType) => {
          if (res.statusCode === 200) {
            clearValues();
          }
        }
      );
    },
  });

  if (
    savingsData == undefined ||
    exchangeDatas == undefined ||
    savingsData.totalSavings == undefined
  ) {
    return <p>Loading...</p>;
  }
  return (
    <div className="w-full h-full border-blue-500 border flex">
      <form className="w-[50%] " onSubmit={handleSubmit}>
        {Object.entries(savingsData.totalSavings).map(([key, value]) => {
          var text = savingRowInformations.find(
            (eachObject) => eachObject.type === key
          )?.placeholder;
          return (
            <div
              className="flex p-4 w-full justify-center items-center gap-x-5  "
              key={key}
            >
              <div
                className={`border rounded flex flex-col justify-center items-center  w-[50%] `}
              >
                <p>
                  {text}: {value.toString()}
                  {key == "gold14" ||
                  key == "gold18" ||
                  key == "gold22" ||
                  key == "gold24"
                    ? " gram"
                    : ""}
                </p>
              </div>
              <InputComponent
                type="number"
                value={values[key as keyof totalSavingsObjectType]}
                placeholder={text}
                parentClassName="w-[25%]"
                className={`${errors.gold14 && "border-red-500"} text-center`}
                name={key}
                onChange={handleChange}
              />
            </div>
          );
        })}

        <div className="flex p-4 w-full justify-center items-center gap-x-5  ">
          <ButtonComponent
            text="Remove"
            itemType="button"
            onClick={() => {
              setIsTotalSavingProcessAdding(false);
            }}
          />
          <ButtonComponent
            text="Ekle"
            itemType="button"
            onClick={() => {
              setIsTotalSavingProcessAdding(true);
            }}
          />
        </div>
      </form>

      <div className="w-[50%] flex flex-col">
        <div className=" w-full p-4 flex flex-col justify-center items-center">
          <p>Hedef Tarih</p>
          <p>{calculatedSavingInformations?.aimDate.toString()}</p>
        </div>
        <div> {calculatedSavingInformations?.requiredSavingsPrice} </div>
      </div>
    </div>
  );
};
export default SavingComponent;
