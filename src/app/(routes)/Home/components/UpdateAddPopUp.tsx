import { ButtonComponent } from "@/components/ButtonComponent";
import { InputComponent } from "@/components/InputComponent";
import {
  isPopupOpenType,
  setExpenseDataChanged,
  setPopupOpen,
} from "@/redux/slices/homePageSlice";
import { RootState } from "@/redux/store";
import { updateExpenseDataByDocumentId } from "@/services/expensesService";
import { expensesType, serviceReturnType } from "@/types/types";
import { updateExpensesSchema } from "@/utils/loginInformationSchemas";
import { MenuItem, Select } from "@mui/material";
import { useFormik } from "formik";
import { JSX, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export const UpdateAddPopUp = (): JSX.Element => {
  const { expenseData } = useSelector(
    (state: RootState) => state.homePageSlice.isPopupOpen
  );
  const dispatch = useDispatch();
  const { handleChange, handleSubmit, values, errors } = useFormik({
    initialValues: {
      amount: expenseData?.amount.toString(),
      imageUrl: expenseData?.imageUrl,
      name: expenseData?.name,
      price: expenseData?.price.toString(),
      rate: expenseData?.rate.toString(),
      isRequired: expenseData?.isRequired ? 1 : 0,
    },
    validationSchema: updateExpensesSchema,
    onSubmit: async (values) => {
      console.log("onSubmit values", values);
      await updateExpenseDataByDocumentId(expenseData!.documentId, {
        amount: Number(values.amount),
        imageUrl: values.imageUrl as string,
        name: values.name as string,
        price: Number(values.price),
        rate: Number(values.rate),
        isRequired: values.isRequired == 1 ? true : false,
        userId: expenseData!.userId,
        isCalculating: expenseData!.isCalculating,
      }).then((res: serviceReturnType) => {
        if (res.statusCode === 200) {
          dispatch(
            setPopupOpen({
              isPopupOpen: false,
              isUpdate: false,
              expenseData: undefined,
            })
          );
          dispatch(setExpenseDataChanged(true));
          toast.success("Updated Successfully");
        } else {
          console.log("error", res.message);
        }
      });
    },
  });

  return (
    <div>
      <div className="w-screen h-screen fixed top-0 left-0 bg-gray-500 opacity-45 flex justify-center items-center   "></div>
      <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center ">
        <form
          className="w-[50%] h-[50%] flex flex-col gap-5 bg-white dark:bg-black  justify-center items-center rounded-md"
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
            name="amount"
            parentClassName="w-[75%]"
            placeholder="Amount"
            value={values.amount}
            className={`${errors.amount && "border-red-500"}`}
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
            name="price"
            parentClassName="w-[75%]"
            placeholder="Price"
            className={`${errors.price && "border-red-500"}`}
            value={values.price}
            onChange={handleChange}
          />

          <InputComponent
            name="rate"
            parentClassName="w-[75%]"
            className={`${errors.rate && "border-red-500"}`}
            placeholder="Rate 1 - 10"
            value={values.rate}
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
            <ButtonComponent text="Update" typeof="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAddPopUp;
