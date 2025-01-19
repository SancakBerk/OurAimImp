"use client";
import {
  addExpense,
  deleteExpensesByDocumentId,
  getUserExpensesByUserId,
  updateExpense,
} from "@/services/userService";
import { expensesDataWithDocumentId, expensesType } from "@/types/types";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ButtonComponent } from "@/components/ButtonComponent";
import {
  setDeletePopUpConfirmation,
  setExpenseDataChanged,
  setPopupOpen,
} from "@/redux/slices/homePageSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
export const Expenses = () => {
  const dispatch = useDispatch();

  const homePageSlice = useSelector((state: RootState) => state.homePageSlice);
  const globalSlice = useSelector((state: RootState) => state.globalSlice);
  const [expensesData, setExpensesData] = useState<
    expensesDataWithDocumentId[]
  >([]);

  useEffect(() => {
    addExpense({
      amount: 10,
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcqgtsGNO_IfzYM6VPS8lNikw4JWE-gsEBjQ&s",
      isRequired: true,
      name: "test",
      price: 10,
      rate: 10,
      userId: "testId2",
    });
    getExpenses();
  }, []);

  useEffect(() => {
    if (homePageSlice.expenseDataChanged == true) {
      getExpenses();
      dispatch(setExpenseDataChanged(false));
    }
  }, [homePageSlice.expenseDataChanged]);

  const getExpenses = async () => {
    await getUserExpensesByUserId(globalSlice.userInformation.userId).then(
      (data) => {
        setExpensesData(data);
      }
    );
  };

  return (
    <div className={`${globalSlice.isDarkMode && "dark"}`}>
      <div
        className={`flex flex-row flex-wrap justify-center w-full h-screen p-10 relative dark:bg-black  `}
      >
        {expensesData.map((eachData: expensesDataWithDocumentId) => {
          return (
            <div
              className=" w-[35%] h-[35%] m-5 flex flex-wrap  border border-blue-950 dark:border-white rounded-md border-opacity-50 p-3 flex-row justify-center "
              key={eachData.documentId}
            >
              <div className="  w-full h-[60%] flex justify-center">
                <Image
                  src={eachData.imageUrl}
                  alt="Image"
                  blurDataURL={eachData.imageUrl}
                  width={500}
                  height={300}
                  className=" bg-contain bg-center bg-no-repeat h-full rounded-md "
                />
              </div>
              <div className="flex w-full h-auto justify-center ">
                <div className="flex flex-col h-full w-[35%] gap-2 dark:text-white  ">
                  <p>İsim: {eachData.name}</p>
                  <p>Zorunlu mu: {eachData.isRequired ? "Evet" : "Hayır"}</p>
                </div>
                <div className=" flex flex-col w-[35%] justify-center gap-2  dark:text-white">
                  <p>Ücret: {eachData.price}$</p>
                  <p>Ne kadar İstiyorsun: {eachData.rate}/10</p>
                </div>
              </div>
              <div className=" w-full h-[10%]   flex justify-center gap-5  ">
                <ButtonComponent
                  onClick={() => {
                    dispatch(
                      setDeletePopUpConfirmation({
                        deleteExpenseData: eachData,
                        showDeletePopUp: true,
                      })
                    );
                  }}
                  text="Sil"
                />
                <ButtonComponent
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
      </div>
    </div>
  );
};

export default Expenses;
