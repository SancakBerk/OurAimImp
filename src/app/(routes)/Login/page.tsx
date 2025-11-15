"use client";
import "./style.css";
import LoginForm from "./components/loginform";
import Image from "next/image";
import ModeButton from "@/components/modeButton";
import TrackImage from "@/../public/track-monthly-expenses.jpg";
import { JSX, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getIsDarkMode, isSessionExpired } from "@/utils/helperFunctions";
import { setModeToRedux } from "@/redux/slices/globalSlice";
import { redirect } from "next/navigation";
import { getCurrentExchangeRates } from "@/services/globalService";

const LoginPage = (): JSX.Element => {
  const darkMode = useSelector(
    (state: RootState) => state.globalSlice.isDarkMode
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isSessionExpired()) {
      redirect("/Home");
    }
    if (getIsDarkMode()) {
      dispatch(setModeToRedux(true));
    }
  }, [dispatch]);

  useEffect(() => {
    getCurrentExchangeRates().then((res) => {
      console.log(res);
    });
  }, []);
  const setDarkModeProp = () => {
    dispatch(setModeToRedux(!darkMode));
  };

  return (
    <div className={`min-h-screen w-full ${darkMode && "dark"}`}>
      <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex justify-center items-center p-4">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />

        {/* Main container */}
        <div className="relative w-full max-w-6xl h-auto min-h-[600px] flex flex-col lg:flex-row gap-8 p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 transition-all duration-500 ease-in-out">
          {/* Left side - Login Form */}
          <div className=" flex-1 flex flex-col justify-center items-center lg:items-start p-4 lg:p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 dark:text-white text-center lg:text-left">
              Welcome Back
            </h1>
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
          </div>

          {/* Right side - Image */}
          <div className="flex-1 flex justify-center items-center p-4 lg:p-8">
            <div className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden shadow-xl transition-transform hover:scale-[1.02] duration-500">
              <Image
                src={TrackImage}
                alt="Expense Tracking Illustration"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
        {/* Mode Button */}
        <ModeButton
          className=" shadow-lg hover:scale-110 transition-transform duration-300 fixed bottom-6 left-6 z-50"
          width={"w-40"}
          setDarkModeProp={setDarkModeProp}
        />
      </div>
    </div>
  );
};

export default LoginPage;
