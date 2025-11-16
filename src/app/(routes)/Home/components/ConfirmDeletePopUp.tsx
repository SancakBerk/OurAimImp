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
import { toast } from "react-toastify";

export const ConfirmDeletePopUp = (): JSX.Element => {
  const dispatch = useDispatch();
  const globalSlice = useSelector((state: RootState) => state.globalSlice);

  const deleteExpenseData = useSelector(
    (state: RootState) =>
      state.homePageSlice.deletePopUpConfirmation.deleteExpenseData
  );

  return (
    <div>
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"></div>
      
      {/* Modal Container */}
      <div
        className={`fixed inset-0 z-50 flex justify-center items-center p-4 ${
          globalSlice.isDarkMode && "dark"
        }`}
      >
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Icon Section */}
          <div className="flex justify-center pt-8 pb-4">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center animate-in zoom-in duration-300 delay-100">
              <svg
                className="w-10 h-10 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 pb-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Ürünü Sil
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
              <span className="font-semibold text-gray-900 dark:text-white">
                {deleteExpenseData?.name}
              </span>{" "}
              ürününü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 px-6 pb-6">
            <button
              onClick={() => {
                dispatch(
                  setDeletePopUpConfirmation({
                    showDeletePopUp: false,
                  })
                );
              }}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              İptal
            </button>
            <button
              onClick={async () => {
                try {
                  await deleteExpensesByDocumentId(deleteExpenseData!.documentId);
                  dispatch(
                    setDeletePopUpConfirmation({
                      showDeletePopUp: false,
                    })
                  );
                  dispatch(setExpenseDataChanged(true));
                  toast.success("Ürün başarıyla silindi!");
                } catch (error) {
                  toast.error("Ürün silinirken bir hata oluştu.");
                }
              }}
              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-red-500/30"
            >
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletePopUp;
