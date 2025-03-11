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
    <div
      className={`${
        globalSlice.isDarkMode && "dark"
      } relative  w-screen h-screen   `}
    >
      {/* <div className="scrollWatch"></div> */}
      <div
        className={`flex   flex-wrap justify-center w-full h-screen overflow-y-scroll  p-10 relative dark:bg-darkBackground opacity-90 pl-[10vw]    max-sm:pt-[10vh] max-sm:px-0   `}
      >
        {expensesData.map((eachData: expensesDataWithDocumentId) => {
          return (
            <div
              className=" w-[45%] h-[50%] m-5 flex flex-wrap  justify-between   border border-blue-950 relative  bg-white bg-opacity-80 dark:bg-opacity-0  dark:border-white rounded-md border-opacity-50 p-3 flex-row  appear max-xl:w-[90%] max-sm:h-[60%]   "
              key={eachData.documentId}
            >
              <div className="  w-full h-[60%] flex justify-center overflow-hidden mb-2 max-sm:mb-0 ">
                <Image
                  loading="lazy"
                  src={eachData.imageUrl}
                  alt="Image"
                  blurDataURL={eachData.imageUrl}
                  width={500}
                  height={300}
                  className=" bg-contain bg-center bg-no-repeat h-full rounded-md hover:scale-105 transition-transform duration-1000    "
                />
              </div>
              <div className="w-full h-[30%]  flex justify-center  ">
                <div className="flex flex-wrap flex-col gap-4 w-[70%]  dark:text-white font-semibold  gap-x-2 max-2xl:text-sm max-sm:gap-0   max-sm:text-xs max-sm:w-[100%] max-sm:gap-y-1 ">
                  <div className="flex text-center  ">
                    <p>İsim: </p>
                    <p>{eachData.name.toUpperCase()} </p>
                  </div>
                  <div className="flex text-center  ">
                    <p>İhtiyaç mı: </p>
                    <p>{eachData.isRequired ? "Evet" : "Hayır"}</p>
                  </div>
                  <div className="flex  text-center ">
                    <p>Ücret: </p>
                    <p>
                      {" "}
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
                  </div>
                  <div className="flex text-center  ">
                    <p>Ne kadar İstiyorsun: </p>
                    <p>{eachData.rate}/10</p>
                  </div>
                </div>
                <div className="h-full flex flex-col dark:text-white font-semibold  max-sm:text-xs ">
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
              <div className=" w-full h-[10%]  flex justify-center gap-5    ">
                <ButtonComponent
                  className="bg-opacity-20    "
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
        <div className=" w-[45%] h-[45%] m-5 flex flex-wrap  border border-black dark:border-white rounded-md border-opacity-50 p-3 flex-row justify-center  bg-white bg-opacity-80 dark:bg-darkBackground appear max-xl:w-[100%] ">
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
