import { RootState } from "@/redux/store";
import {
  exchangeDataType,
  serviceReturnType,
  totalSavingsObjectType,
  totalSavingsType,
  totalSavingTypeWithDocumentId,
  verticalNavbarProps,
} from "@/types/types";
import React, { JSX, use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PieChart } from "@mui/x-charts/PieChart";
import {
  getTotalSavingDataById,
  UpdateTotalSavingsData,
} from "@/services/savingService";
import { getCurrentExchangeRates } from "@/services/globalService";
import { InputComponent } from "@/components/InputComponent";
import { Button } from "@mui/material";
import { ButtonComponent } from "@/components/ButtonComponent";
import { useFormik } from "formik";
import { addSavingsSchema } from "@/utils/loginInformationSchemas";
import { toast } from "react-toastify";
export const SavingComponent = (): JSX.Element => {
  const globalSlice = useSelector((state: RootState) => state.globalSlice);
  const [exchangeDatas, setExchangeDatas] = useState<exchangeDataType>();
  const [savingsData, setSavingsData] =
    useState<totalSavingTypeWithDocumentId | null>(null);
  useEffect(() => {
    getTotalSavingDataById(globalSlice.userInformation.userId).then(
      (res: serviceReturnType) => {
        if (res.statusCode === 200 && res.data != undefined) {
          setSavingsData(res.data[0] as totalSavingTypeWithDocumentId);
        }
      }
    );
    getCurrentExchangeRates().then((res: serviceReturnType) => {
      var object: exchangeDataType = {
        dollar: res.data?.USD,
        gold14: res.data?.["14-ayar-altin"],
        euro: res.data?.EUR,
        gold18: res.data?.["18-ayar-altin"],
        gold22: res.data?.["gram-altin"],
        gold24: res.data?.["gram-has-altin"],
      };

      setExchangeDatas(object);
    });
  }, []);

  // const addSavings = (theSavingsData:totalSavingsObjectType,) =>
  // {}

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
      console.log("values", values);
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
          object.totalSavings[key as keyof totalSavingsObjectType] += value;
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
        <div className="flex p-4 w-full justify-center items-center gap-x-5  ">
          <div
            className={`border rounded flex flex-col justify-center items-center  `}
          >
            <p>
              Altın-14 ayar: {savingsData.totalSavings.gold14.toString()} gram
            </p>
          </div>
          <InputComponent
            type="number"
            value={values.gold14}
            parentClassName="w-[25%]"
            className={`${errors.gold14 && "border-red-500"} text-center`}
            name="gold14"
            onChange={handleChange}
          />
          <ButtonComponent text="Ekle" typeof="submit" />
        </div>
        <div className="flex p-4 w-full justify-center items-center gap-x-5  ">
          <div className="border rounded flex flex-col justify-center items-center ">
            <p>
              Altın-18 ayar: {savingsData.totalSavings.gold18.toString()} gram
            </p>
          </div>
          <InputComponent
            value={values.gold18}
            type="number"
            parentClassName="w-[25%]"
            className={`${errors.gold18 && "border-red-500"} text-center`}
            name="gold18"
            onChange={handleChange}
          />
          <ButtonComponent text="Ekle" />
        </div>
        <div className="flex p-4 w-full justify-center items-center gap-x-5  ">
          <div className="border rounded flex flex-col justify-center items-center ">
            <p>
              Altın-22 ayar: {savingsData.totalSavings.gold22.toString()} gram
            </p>
          </div>
          <InputComponent
            value={values.gold22}
            type="number"
            parentClassName="w-[25%]"
            name="gold22"
            className={`${errors.gold22 && "border-red-500"} text-center`}
            onChange={handleChange}
          />
          <ButtonComponent text="Ekle" />
        </div>
        <div className="flex p-4 w-full justify-center items-center gap-x-5  ">
          <div className="border rounded flex flex-col justify-center items-center ">
            <p>
              Altın-24 ayar: {savingsData.totalSavings.gold24.toString()} gram
            </p>
          </div>
          <InputComponent
            value={values.gold24}
            type="number"
            parentClassName="w-[25%]"
            className={`${errors.gold24 && "border-red-500"} text-center`}
            name="gold24"
            onChange={handleChange}
          />
          <ButtonComponent text="Ekle" />
        </div>
        <div className="flex p-4 w-full justify-center items-center gap-x-5  ">
          <div className="border rounded flex flex-col justify-center items-center ">
            <p>Dolar: {savingsData.totalSavings.dollar.toString()} </p>
          </div>
          <InputComponent
            type="number"
            value={values.dollar}
            parentClassName="w-[25%]"
            className={`${errors.dollar && "border-red-500"} text-center`}
            name="dollar"
            onChange={handleChange}
          />
          <ButtonComponent text="Ekle" />
        </div>
        <div className="flex p-4 w-full justify-center items-center gap-x-5  ">
          <div className="border rounded flex flex-col justify-center items-center ">
            <p>Euro: {savingsData.totalSavings.euro.toString()} </p>
          </div>
          <InputComponent
            value={values.euro}
            type="number"
            parentClassName="w-[25%]"
            name="euro"
            className={`${errors.euro && "border-red-500"} text-center`}
            onChange={handleChange}
          />
          <ButtonComponent text="Ekle" />
        </div>
        <div className="flex p-4 w-full justify-center items-center gap-x-5  ">
          <div className="border rounded flex flex-col justify-center items-center ">
            <p>Fon: {savingsData.totalSavings.fon.toString()} </p>
          </div>
          <InputComponent
            value={values.fon}
            type="number"
            parentClassName="w-[25%]"
            name="fon"
            className={`${errors.fon && "border-red-500"} text-center`}
            onChange={handleChange}
          />
          <ButtonComponent text="Ekle" />
        </div>
        <div className="flex p-4 w-full justify-center items-center gap-x-5  ">
          <div className="border rounded flex flex-col justify-center items-center ">
            <p>Tl: {savingsData.totalSavings.tl.toString()} </p>
          </div>
          <InputComponent
            value={values.tl}
            type="number"
            parentClassName="w-[25%]"
            name="tl"
            className={`${errors.tl && "border-red-500"} text-center`}
            onChange={handleChange}
          />
          <ButtonComponent text="Ekle" />
        </div>
        <div className="flex p-4 w-full justify-center items-center gap-x-5  ">
          <div className="border rounded flex flex-col justify-center items-center ">
            <p>Hisse: {savingsData.totalSavings.hisse.toString()}</p>
          </div>
          <InputComponent
            value={values.hisse}
            type="number"
            parentClassName="w-[25%]"
            className={`${errors.hisse && "border-red-500"} text-center`}
            name="hisse"
            onChange={handleChange}
          />
          <ButtonComponent text="Ekle" />
        </div>
      </form>

      <div className="w-[50%]">
        <p>Some Graphs</p>
      </div>
    </div>
  );
};
export default SavingComponent;
