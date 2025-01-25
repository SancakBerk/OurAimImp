"use client";
import { getIsDarkMode } from "@/utils/helperFunctions";
import { useFormik } from "formik";
import { JSX, use, useState } from "react";
import { loginInformationSchema } from "@/utils/loginInformationSchemas";
import { redirect, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import jwt from "jsonwebtoken";

import {
  collection,
  doc,
  DocumentData,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebaseconfig";
import { userType } from "@/types/types";
import exp from "constants";
import { setLoginInitialStates } from "@/redux/slices/globalSlice";
import { useDispatch } from "react-redux";
import { InputComponent } from "@/components/InputComponent";
require("dotenv").config();
const LoginForm = (): JSX.Element => {
  const [isDarkMode, setisDarkMode] = useState(getIsDarkMode());
  const router = useRouter();
  const dispatch = useDispatch();
  const { handleChange, handleSubmit, values, errors } = useFormik({
    initialValues: {
      email: "",
      password: "",
      checkbox: "",
    },
    validationSchema: loginInformationSchema,
    onSubmit: async (values) => {
      await checkLogin();
    },
  });
  const checkLogin = async (): Promise<void> => {
    try {
      const userCollection = collection(db, "users");
      const userQuery = query(
        userCollection,
        where("email", "==", values.email)
      );
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.docs.length !== 1) {
        toast.error("User not found or Duplicated");
        return;
      }
      const userData = userSnapshot.docs[0].data() as userType;
      if (userData.password !== values.password) {
        toast.error("Password is incorrect");
        return;
      }
      // localStorage.setItem("userToken", userToken);
      dispatch(
        setLoginInitialStates({
          email: userData.email,
          userId: userData.userId,
          documentId: userSnapshot.docs[0].id,
        })
      );
      router.push("/Home");
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`${
          isDarkMode && "dark"
        }  flex flex-col justify-center  w-full h-full gap-4  `}
      >
        <label htmlFor="email" className="   dark:text-white text-lg ">
          Email Address
        </label>
        <div className="w-[50%]">
          <InputComponent
            id="email"
            name="email"
            type="email"
            placeholder="Email Adresinizi Giriniz..."
            onChange={handleChange}
            value={values.email}
          />
        </div>
        {errors.email && <p className=" text-red-600">{errors.email}</p>}

        <label htmlFor="password" className="text-lg dark:text-white ">
          Password
        </label>
        <div className="w-[50%]">
          <InputComponent
            id="password"
            name="password"
            type="password"
            placeholder="Şifrenizi Giriniz..."
            onChange={handleChange}
            value={values.password}
          />
        </div>
        {errors.password && <p className=" text-red-600">{errors.password}</p>}

        <div className="flex items-center gap-4 h-10 ">
          <label htmlFor="checkbox" className="dark:text-white text-black">
            Beni Hatırla
          </label>
          <input
            type="checkbox"
            id="checkbox"
            className="h-full w-5"
            onChange={handleChange}
            value={values.checkbox}
          />
        </div>
        <div>
          <button type="submit" className="border p-2 dark:text-white">
            Submit
          </button>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default LoginForm;
