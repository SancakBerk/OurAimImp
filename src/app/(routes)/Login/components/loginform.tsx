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
      console.log('🔍 Attempting login for:', values.email);
      
      const userCollection = collection(db, "users");
      const userQuery = query(
        userCollection,
        where("email", "==", values.email)
      );
      const userSnapshot = await getDocs(userQuery);

      console.log('📊 Users found:', userSnapshot.docs.length);

      if (userSnapshot.docs.length === 0) {
        toast.error("Kullanıcı bulunamadı. Lütfen kayıt olun.");
        return;
      }
      
      if (userSnapshot.docs.length > 1) {
        toast.error("Birden fazla kullanıcı bulundu. Lütfen yönetici ile iletişime geçin.");
        return;
      }

      const userData = userSnapshot.docs[0].data() as userType;
      console.log('✅ User found:', userData.email);
      
      if (userData.password !== values.password) {
        toast.error("Şifre hatalı!");
        return;
      }

      console.log('✅ Login successful!');
      const session = JSON.stringify({
        userId: userData.userId,
        systemEnterDate: new Date().getTime(),
        systemExpiresDate: new Date(Date.now() + 1000 * 60 * 60 * 24).getTime(),
      });
      localStorage.setItem("session", session);
      dispatch(setUserIdToRedux(userData.userId));
      toast.success("Giriş başarılı!");
      
      setTimeout(() => {
        router.push("/Home");
      }, 500);
    } catch (error: unknown) {
      console.error("❌ Login error:", error);
      
      const err = error as { code?: string; message?: string };
      if (err.code === 'permission-denied') {
        toast.error("Firebase bağlantı hatası. Lütfen Firebase ayarlarınızı kontrol edin.");
      } else if (err.message?.includes('projectId')) {
        toast.error("Firebase yapılandırması eksik. .env dosyanızı kontrol edin.");
      } else {
        toast.error("Giriş yapılırken bir hata oluştu: " + (err.message || "Bilinmeyen hata"));
      }
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
        <div className="  w-1/2 h-full justify-center gap-4  flex flex-col max-2xl:gap-1 max-2xl:w-[80%] max-md:w-full ">
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
              autoComplete="email"
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
              autoComplete="current-password"
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
                autoComplete="new-password"
              />
            </div>
          )}
          {touched.password && errors.passwordCheck && isRegistering && (
            <p className=" text-red-600">{errors.password}</p>
          )}
          <div className=" flex gap-5 dark:text-white max-2xl:text-sm ">
            <button className=" text-gray-500 " disabled>
              <p>Şifremi Unuttum</p>
            </button>

            <ButtonComponent
              type="button"
              onClick={() => {
                setisRegistering(!isRegistering);
              }}
              className="border-none"
            >
              <p> {isRegistering ? "Giriş Yap" : "Kayıt ol"} </p>
            </ButtonComponent>
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
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
        style={{ maxWidth: '400px' }}
      />
    </>
  );
};

export default LoginForm;
