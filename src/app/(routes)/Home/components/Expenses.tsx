"use client";
import {} from "@/services/userService";
import { expensesDataWithDocumentId, serviceReturnType } from "@/types/types";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ButtonComponent } from "@/components/ButtonComponent";
import {
  setCurrentExpenseData,
  setDeletePopUpConfirmation,
  setExpenseDataChanged,
  setPopupOpen,
} from "@/redux/slices/homePageSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Checkbox } from "@mui/material";
import {
  getUserExpensesByUserId,
  updateExpenseDataByDocumentId,
} from "@/services/expensesService";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import "@/app/(routes)/Home/style.css";

export const Expenses = () => {
  const dispatch = useDispatch();

  const homePageSlice = useSelector((state: RootState) => state.homePageSlice);
  const globalSlice = useSelector((state: RootState) => state.globalSlice);
  const [expensesData, setExpensesData] = useState<
    expensesDataWithDocumentId[]
  >([]);

  useEffect(() => {
    if (homePageSlice.currentExpenseData.length > 0) {
      setExpensesData(homePageSlice.currentExpenseData);
    }
  }, []);

  useEffect(() => {
    if (homePageSlice.expenseDataChanged) {
      getExpenses();
      dispatch(setExpenseDataChanged(false));
    }
  }, [homePageSlice.expenseDataChanged]);

  useEffect(() => {
    setExpensesData(homePageSlice.currentExpenseData);
  }, [homePageSlice.currentExpenseData]);

  const getExpenses = async () => {
    await getUserExpensesByUserId(globalSlice.userId).then(
      (data: serviceReturnType) => {
        if (data.statusCode == 200) {
          setCurrentExpenseData(data.data as expensesDataWithDocumentId[]);
          setExpensesData(data.data as expensesDataWithDocumentId[]);
        }
      }
    );
  };

  return (
    <div className={`${globalSlice.isDarkMode && "dark"}  `}>
      <div
        className={`flex flex-row flex-wrap justify-center w-full h-screen overflow-x-hidden p-10 relative dark:bg-darkBackground opacity-90 pl-[10vw]  `}
      >
        {expensesData.map((eachData: expensesDataWithDocumentId) => {
          return (
            <div
              className=" w-[45%] h-[45%] m-5 flex flex-wrap  justify-between   border border-blue-950 relative  bg-white bg-opacity-80 dark:bg-opacity-0  dark:border-white rounded-md border-opacity-50 p-3 flex-row  appear "
              key={eachData.documentId}
            >
              <div className="absolute top-3 right-3 gap- w-[10%] h-[5%] flex justify-center items-center dark:text-white ">
                {eachData.amount} x
              </div>
              <div className="  w-full h-[60%] flex justify-center overflow-hidden  ">
                <Image
                  src={eachData.imageUrl}
                  alt="Image"
                  blurDataURL={eachData.imageUrl}
                  width={500}
                  height={300}
                  className=" bg-contain bg-center bg-no-repeat h-full rounded-md hover:scale-105 transition-transform duration-1000    "
                />
              </div>
              <div className="w-full  flex justify-center  ">
                <div className="grid w-[70%] grid-cols-2 grid-rows-2 dark:text-white font-semibold  ">
                  <p>İsim: {eachData.name.toUpperCase()}</p>
                  <p>İhtiyaç mı: {eachData.isRequired ? "Evet" : "Hayır"}</p>
                  <p>
                    Ücret:{" "}
                    {(
                      eachData.price *
                      homePageSlice.currentExchangeRates.dollar.Alış *
                      eachData.amount
                    ).toFixed(0)}
                    TL ({" "}
                    {(
                      eachData.price *
                      homePageSlice.currentExchangeRates.dollar.Alış
                    ).toFixed(0)}{" "}
                    x {eachData.amount})
                  </p>
                  <p>Ne kadar İstiyorsun: {eachData.rate}/10</p>
                </div>
                <div className="h-full flex flex-col dark:text-white font-semibold ">
                  <p>Hesapla:</p>
                  <Checkbox
                    checked={eachData.isCalculating}
                    color="success"
                    onChange={async (e) => {
                      await updateExpenseDataByDocumentId(eachData.documentId, {
                        amount: eachData.amount,
                        imageUrl: eachData.imageUrl,
                        isCalculating: e.target.checked,
                        isRequired: eachData.isRequired,
                        name: eachData.name,
                        price: eachData.price,
                        rate: eachData.rate,
                        userId: eachData.userId,
                      });
                      dispatch(setExpenseDataChanged(true));
                    }}
                  />
                </div>
              </div>
              <div className=" w-full   flex justify-center gap-5  ">
                <ButtonComponent
                  className="bg-opacity-20  "
                  onClick={() => {
                    dispatch(
                      setDeletePopUpConfirmation({
                        deleteExpenseData: eachData,
                        showDeletePopUp: true,
                      })
                    );
                  }}
                >
                  <p className="text-red-600 ">Sil</p>
                </ButtonComponent>
                <ButtonComponent
                  className="bg-opacity-20"
                  onClick={() => {
                    dispatch(
                      setPopupOpen({
                        isPopupOpen: true,
                        isUpdate: true,
                        expenseData: eachData,
                      })
                    );
                  }}
                  text="Güncelle"
                />
              </div>
            </div>
          );
        })}
        <div className=" w-[45%] h-[45%] m-5 flex flex-wrap  border border-black dark:border-white rounded-md border-opacity-50 p-3 flex-row justify-center  bg-white bg-opacity-80 dark:bg-darkBackground appear ">
          <div className="w-full h-full  flex justify-center items-center">
            <ButtonComponent
              className=" text-[100px] jumping "
              onClick={() => {
                dispatch(
                  setPopupOpen({
                    isPopupOpen: true,
                    isUpdate: false,
                    expenseData: undefined,
                  })
                );
              }}
            >
              <MdOutlineAddCircleOutline className=" dark:text-white" />
            </ButtonComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
