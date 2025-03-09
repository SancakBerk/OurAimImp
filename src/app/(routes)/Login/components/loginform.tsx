"use client";

import { useFormik } from "formik";
import { JSX, useEffect, useRef, useState } from "react";
import { loginInformationSchema } from "@/utils/loginInformationSchemas";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebaseconfig";
import { serviceReturnType, userType } from "@/types/types";
import { setUserIdToRedux } from "@/redux/slices/globalSlice";
import { useDispatch } from "react-redux";
import { InputComponent } from "@/components/InputComponent";
import { ButtonComponent } from "@/components/ButtonComponent";
import { createUserService } from "@/services/userService";
const LoginForm = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isRegistering, setisRegistering] = useState<boolean>(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    initialValues: {
      email: "",
      password: "",
      passwordCheck: "",
    },
    validationSchema: loginInformationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async () => {
      if (isRegistering) {
        await createAccount();
        return;
      } else {
        await checkLogin();
      }
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

      const session = JSON.stringify({
        userId: userData.userId,
        systemEnterDate: new Date().getTime(),
        systemExpiresDate: new Date(Date.now() + 1000 * 60 * 60 * 24).getTime(),
      });
      localStorage.setItem("session", session);
      dispatch(setUserIdToRedux(userData.userId));
      router.push("/Home");
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  };

  const createAccount = async (): Promise<void> => {
    if (values.password !== values.passwordCheck) {
      toast.error("Passwords are not the same");
      return;
    }
    await createUserService({
      email: values.email,
      password: values.password,
    }).then((res: serviceReturnType) => {
      console.log("res", res);
      const session = JSON.stringify({
        userId: res.data.userId,
        systemEnterDate: new Date().getTime(),
        systemExpiresDate: new Date(Date.now() + 1000 * 60 * 60 * 24).getTime(),
      });
      localStorage.setItem("session", session);
      dispatch(setUserIdToRedux(res.data.userId));
      router.push("/Home");
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`flex  justify-center items-center  w-full h-full gap-4  max-md:gap-0  `}
      >
        <div className=" w-1/2 h-full justify-center gap-4  flex flex-col max-2xl:gap-1 max-2xl:w-[80%] max-md:w-full ">
          <label
            htmlFor="email"
            className="   dark:text-white text-lg max-2xl:text-sm "
          >
            Email
          </label>
          <div className="w-[100%]">
            <InputComponent
              ref={inputRef}
              id="email"
              name="email"
              type="email"
              placeholder="Email Adresinizi Giriniz..."
              onChange={handleChange}
              value={values.email}
            />
          </div>
          {touched.email && errors.email && (
            <p className=" text-red-600">{errors.email}</p>
          )}

          <label htmlFor="password" className="text-lg dark:text-white ">
            Şifre
          </label>
          <div className="w-[100%]">
            <InputComponent
              id="password"
              name="password"
              type="password"
              placeholder="Şifrenizi Giriniz..."
              onChange={handleChange}
              value={values.password}
            />
          </div>
          {touched.password && errors.password && (
            <p className=" text-red-600">{errors.password}</p>
          )}
          {isRegistering && (
            <div className="w-[100%]">
              <InputComponent
                id="passwordCheck"
                name="passwordCheck"
                type="password"
                placeholder="Şifrenizi Tekrar Giriniz..."
                onChange={handleChange}
                value={values.passwordCheck}
              />
            </div>
          )}
          {touched.password && errors.passwordCheck && isRegistering && (
            <p className=" text-red-600">{errors.password}</p>
          )}
          <div className=" flex gap-5 dark:text-white max-2xl:text-sm max-sm:flex-col ">
            <button className=" text-gray-500 " disabled>
              <p>Şifremi Unuttum</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setisRegistering(!isRegistering);
              }}
            >
              <p> {isRegistering ? "Giriş Yap" : "Kayıt ol"} </p>
            </button>
          </div>

          <div>
            <ButtonComponent
              text={isRegistering ? "Kayıt Ol" : "Giriş Yap"}
              type="submit"
              onClick={() => {
                "submit butona tıklandı";
              }}
              className="border p-2 dark:text-white"
            />
          </div>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default LoginForm;
