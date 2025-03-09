import { ButtonComponent } from "@/components/ButtonComponent";
import { InputComponent } from "@/components/InputComponent";
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
        const object: expensesType = {
          amount: Number(values.amount),
          imageUrl: values.imageUrl as string,
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
            } else {
              console.log("error", res.message);
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
              toast.success("Added Successfully");
            }
          });
        }
      },
    });

  useEffect(() => {
    if (values.isRequired == 1) {
      setFieldValue("rate", "10");
    }
  }, [values.isRequired]); // isRequired değiştiğinde çalışır.

  return (
    <div className=" smoothVisible ">
      <div className="w-screen h-screen fixed top-0 left-0 bg-gray-500 opacity-45 flex justify-center items-center"></div>
      <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-50  ">
        <form
          className="w-[50%] h-[50%] flex flex-col gap-5 bg-white dark:bg-darkBackground  justify-center items-center rounded-md max-sm:w-[80%] max-sm:h-[80%] "
          onSubmit={handleSubmit}
        >
          <InputComponent
            name="name"
            parentClassName="w-[75%]"
            placeholder="Name"
            value={values.name}
            className={`${errors.name && "border-red-500"}`}
            onChange={handleChange}
          />

          <InputComponent
            name="price"
            parentClassName="w-[75%]"
            placeholder="Price"
            className={`${errors.price && "border-red-500"}`}
            value={values.price}
            onChange={handleChange}
          />
          <InputComponent
            name="imageUrl"
            parentClassName="w-[75%]"
            placeholder="Image Url"
            className={`${errors.imageUrl && "border-red-500"}`}
            value={values.imageUrl}
            onChange={handleChange}
          />

          <InputComponent
            name="amount"
            parentClassName="w-[75%]"
            placeholder="Amount"
            value={values.amount}
            className={`${errors.amount && "border-red-500"}`}
            onChange={handleChange}
          />
          <div className="w-[75%] ">
            <Select
              name="isRequired"
              className={`dark:text-white dark:border-white border`}
              value={values.isRequired}
              label="İs Required"
              onChange={handleChange}
            >
              <MenuItem value={0}>Request</MenuItem>
              <MenuItem value={1}>Required</MenuItem>
            </Select>
          </div>
          <InputComponent
            name="rate"
            parentClassName="w-[75%]"
            className={`${errors.rate && "border-red-500"} ${
              values.isRequired == 1
                ? "bg-gray-300 dark:bg-gray-700"
                : "bg-white dark:bg-darkBackground"
            }`}
            placeholder="Rate 1 - 10"
            value={values.rate}
            disabled={values.isRequired == 1 ? true : false}
            onChange={handleChange}
          />

          <div className="flex w-[75%]  justify-center items-center  gap-x-10  ">
            <ButtonComponent
              text="Close"
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
              text={homePageSlice.isPopupOpen.isUpdate ? "Update" : "Add"}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAddPopUp;
