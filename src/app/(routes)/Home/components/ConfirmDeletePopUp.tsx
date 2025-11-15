"use client";
import { ButtonComponent } from "@/components/ButtonComponent";
import {
  setDeletePopUpConfirmation,
  setExpenseDataChanged,
} from "@/redux/slices/homePageSlice";
import { RootState } from "@/redux/store";
import { deleteExpensesByDocumentId } from "@/services/expensesService";
import { JSX } from "react";
import { useDispatch, useSelector } from "react-redux";

export const ConfirmDeletePopUp = (): JSX.Element => {
  const dispatch = useDispatch();
  const globalSlice = useSelector((state: RootState) => state.globalSlice);

  const deleteExpenseData = useSelector(
    (state: RootState) =>
      state.homePageSlice.deletePopUpConfirmation.deleteExpenseData
  );

  return (
    <div>
      <div className="fixed inset-0 bg-slate-600 opacity-80 z-50 flex justify-center items-center"></div>
      <div
        className={`fixed inset-0 z-50 flex justify-center items-center ${
          globalSlice.isDarkMode && "dark"
        } `}
      >
        <div className="w-[50%] h-[50%] flex justify-center items-center flex-col border  border-black rounded-lg bg-white gap-y-10 dark:bg-darkBackground max-sm:w-[80%] max-sm:h-[80%] ">
          <p className=" text-2xl dark:text-white max-sm:text-sm text-center ">
            {" "}
            Silmek istediğine emin misin?{" "}
          </p>
          <div className="flex w-full h-auto justify-center items-center gap-x-10">
            <ButtonComponent
              text="Evet"
              onClick={() => {
                deleteExpensesByDocumentId(deleteExpenseData!.documentId);
                dispatch(
                  setDeletePopUpConfirmation({
                    showDeletePopUp: false,
                  })
                );
                dispatch(setExpenseDataChanged(true));
              }}
            />
            <ButtonComponent
              text="Hayır"
              onClick={() => {
                dispatch(
                  setDeletePopUpConfirmation({
                    showDeletePopUp: false,
                  })
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletePopUp;
