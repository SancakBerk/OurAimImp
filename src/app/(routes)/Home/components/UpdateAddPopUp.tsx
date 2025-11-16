import { ButtonComponent } from "@/components/ButtonComponent";
import { InputComponent } from "@/components/InputComponent";
import { ImageUpload } from "@/components/ImageUpload";
import {
  setExpenseDataChanged,
  setPopupOpen,
} from "@/redux/slices/homePageSlice";
import { RootState } from "@/redux/store";
import {
  addExpense,
  updateExpenseDataByDocumentId,
} from "@/services/expensesService";
import { expensesType, serviceReturnType } from "@/types/types";
import { getFloatValueAsFixed2 } from "@/utils/helperFunctions";
import { updateExpensesSchema } from "@/utils/loginInformationSchemas";
import { MenuItem, Select } from "@mui/material";
import { useFormik } from "formik";
import { JSX, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export const UpdateAddPopUp = (): JSX.Element => {
  const homePageSlice = useSelector((state: RootState) => state.homePageSlice);
  const globalSlice = useSelector((state: RootState) => state.globalSlice);

  const [reduxExpenseData, setReduxExpenseData] = useState(
    homePageSlice.isPopupOpen.expenseData
  );

  const dispatch = useDispatch();
  useEffect(() => {
    setReduxExpenseData(homePageSlice.isPopupOpen.expenseData);
  }, [homePageSlice.isPopupOpen.expenseData]);

  const { handleChange, handleSubmit, values, errors, setFieldValue } =
    useFormik({
      initialValues: {
        amount: reduxExpenseData ? reduxExpenseData.amount.toString() : "",
        imageUrl: reduxExpenseData ? reduxExpenseData.imageUrl : "",
        name: reduxExpenseData ? reduxExpenseData.name : "",
        price: reduxExpenseData
          ? (
              reduxExpenseData.price *
              homePageSlice.currentExchangeRates.dollar.Alış
            ).toFixed(0)
          : "",
        rate: reduxExpenseData ? reduxExpenseData.rate.toString() : "",
        isRequired: reduxExpenseData
          ? reduxExpenseData.isRequired
            ? 1
            : 0
          : 0,
      },
      validationSchema: updateExpensesSchema,
      onSubmit: async (values) => {
        console.log('🔍 UpdateAddPopUp - globalSlice.userId:', globalSlice.userId);
        console.log('🔍 UpdateAddPopUp - userId type:', typeof globalSlice.userId);
        console.log('🔍 UpdateAddPopUp - userId length:', globalSlice.userId?.length);
        
        if (!globalSlice.userId || globalSlice.userId.trim() === '') {
          console.error('❌ userId is empty or undefined!');
          toast.error("Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
          return;
        }
        
        const object: expensesType = {
          amount: Number(values.amount),
          imageUrl: values.imageUrl || "",
          name: values.name as string,
          price: getFloatValueAsFixed2(
            parseFloat(values.price) /
              homePageSlice.currentExchangeRates.dollar.Alış
          ),
          rate: Number(values.rate),
          isRequired: values.isRequired == 1 ? true : false,
          userId: globalSlice.userId,
          isCalculating: reduxExpenseData
            ? reduxExpenseData.isCalculating
            : true,
        };
        if (homePageSlice.isPopupOpen.isUpdate) {
          await updateExpenseDataByDocumentId(
            reduxExpenseData!.documentId,
            object
          ).then((res: serviceReturnType) => {
            if (res.statusCode === 200) {
              dispatch(
                setPopupOpen({
                  isPopupOpen: false,
                  isUpdate: false,
                  expenseData: undefined,
                })
              );
              dispatch(setExpenseDataChanged(true));
              toast.success("Ürün başarıyla güncellendi!");
            } else {
              console.log("error", res.message);
              toast.error("Ürün güncellenirken bir hata oluştu.");
            }
          });
        } else {
          addExpense(object).then((res) => {
            if (res.statusCode === 200) {
              dispatch(
                setPopupOpen({
                  isPopupOpen: false,
                  isUpdate: false,
                  expenseData: undefined,
                })
              );
              dispatch(setExpenseDataChanged(true));
              toast.success("Ürün başarıyla eklendi!");
            } else {
              toast.error("Ürün eklenirken bir hata oluştu.");
            }
          });
        }
      },
    });

  useEffect(() => {
    if (values.isRequired == 1) {
      setFieldValue("rate", "10");
    }
  }, [values.isRequired, setFieldValue]); // isRequired değiştiğinde çalışır.

  return (
    <div className="smoothVisible">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
        onClick={() => {
          dispatch(
            setPopupOpen({
              isPopupOpen: false,
              isUpdate: false,
              expenseData: undefined,
            })
          );
        }}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex justify-center items-center z-50 pointer-events-none px-4">
        <form
          className="glass-effect w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col gap-6 p-6 md:p-8 rounded-2xl shadow-2xl pointer-events-auto"
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {homePageSlice.isPopupOpen.isUpdate
                ? "Ürünü Güncelle"
                : "Yeni Ürün Ekle"}
            </h2>
            <button
              type="button"
              onClick={() => {
                dispatch(
                  setPopupOpen({
                    isPopupOpen: false,
                    isUpdate: false,
                    expenseData: undefined,
                  })
                );
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <InputComponent
              name="name"
              label="Ürün Adı"
              placeholder="Ürün adını giriniz"
              value={values.name}
              error={errors.name}
              onChange={handleChange}
            />

            <InputComponent
              name="price"
              type="number"
              label="Fiyat (TL)"
              placeholder="Fiyat giriniz"
              value={values.price}
              error={errors.price}
              onChange={handleChange}
            />

            <ImageUpload
              value={values.imageUrl}
              onChange={(imageUrl) => setFieldValue("imageUrl", imageUrl)}
              error={errors.imageUrl}
            />

            <InputComponent
              name="amount"
              type="number"
              label="Miktar"
              placeholder="Miktar giriniz"
              value={values.amount}
              error={errors.amount}
              onChange={handleChange}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tür
              </label>
              <Select
                name="isRequired"
                className="w-full dark:text-white dark:border-gray-600 border border-gray-300 rounded-lg"
                value={values.isRequired}
                onChange={handleChange}
              >
                <MenuItem value={0}>İstek</MenuItem>
                <MenuItem value={1}>İhtiyaç</MenuItem>
              </Select>
            </div>

            <InputComponent
              name="rate"
              type="number"
              label="İstek Derecesi (1-10)"
              placeholder="1-10 arası değer giriniz"
              value={values.rate}
              error={errors.rate}
              disabled={values.isRequired == 1}
              onChange={handleChange}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <ButtonComponent
              type="button"
              variant="secondary"
              className="flex-1"
              text="İptal"
              onClick={() => {
                dispatch(
                  setPopupOpen({
                    isPopupOpen: false,
                    isUpdate: false,
                    expenseData: undefined,
                  })
                );
              }}
            />
            <ButtonComponent
              type="submit"
              variant="primary"
              className="flex-1"
              text={homePageSlice.isPopupOpen.isUpdate ? "Güncelle" : "Ekle"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAddPopUp;
