"use client";
import {} from "@/services/userService";
import {
  expensesDataWithDocumentId,
  expensesType,
  serviceReturnType,
} from "@/types/types";
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
import { Checkbox } from "@mui/material";
import {
  getUserExpensesByUserId,
  updateExpenseDataByDocumentId,
} from "@/services/expensesService";
export const Expenses = () => {
  const dispatch = useDispatch();

  const homePageSlice = useSelector((state: RootState) => state.homePageSlice);
  const globalSlice = useSelector((state: RootState) => state.globalSlice);
  const [expensesData, setExpensesData] = useState<
    expensesDataWithDocumentId[]
  >([]);

  useEffect(() => {
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
      (data: serviceReturnType) => {
        if (data.statusCode == 200) {
          setExpensesData(data.data as expensesDataWithDocumentId[]);
        }
      }
    );
  };

  return (
    <div className={`${globalSlice.isDarkMode && "dark"}`}>
      <div
        className={`flex flex-row flex-wrap justify-center w-full h-screen overflow-x-hidden p-10 relative dark:bg-black  `}
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
              <div className="w-full flex justify-center  ">
                <div className="grid w-[70%] grid-cols-2 grid-rows-2 dark:text-white  ">
                  <p>İsim: {eachData.name}</p>
                  <p>İhtiyaç mı: {eachData.isRequired ? "Evet" : "Hayır"}</p>
                  <p>Ücret: {eachData.price}$</p>
                  <p>Ne kadar İstiyorsun: {eachData.rate}/10</p>
                </div>
                <div className="h-full flex flex-col dark:text-white ">
                  <p>Hesapla:</p>
                  <Checkbox
                    className="dark:text-white "
                    checked={eachData.isCalculating}
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
