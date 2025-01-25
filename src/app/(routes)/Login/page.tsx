"use client";
import "./style.css";
import LoginForm from "./components/loginform";
import Image from "next/image";
import ModeButton from "@/components/modeButton";
import myScaryGirl from "@/../public/myScaryGirl.png";
import { JSX, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getIsDarkMode } from "@/utils/helperFunctions";
import { get } from "http";
import { setModeToRedux } from "@/redux/slices/globalSlice";

const LoginPage = (): JSX.Element => {
  const darkMode = useSelector(
    (state: RootState) => state.globalSlice.isDarkMode
  );

  const setDarkModeProp = (mode: boolean) => {
    setModeToRedux(!darkMode);
  };

  return (
    <div className={` dark:bg-black  ${darkMode && "dark"} slideIn `}>
      <div className="w-screen h-screen bg-white flex justify-center items-center relative dark:bg-black ">
        <div className="w-[40%] h-[50%]  flex  border p-5 rounded-lg ">
          <div className="w-[50%] h-full   ">
            <LoginForm />
          </div>
          <div className="w-[50%] h-full flex justify-center items-center">
            <Image
              src={myScaryGirl}
              className=" rounded-lg "
              alt="myScaryGirl"
              width={522}
              height={520}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-[5%] left-[5%] ">
        <ModeButton setDarkModeProp={setDarkModeProp} />
      </div>
    </div>
  );
};

export default LoginPage;
