"use client";
import "./style.css";
import LoginForm from "./components/loginform";
import Image from "next/image";
import ModeButton from "@/components/modeButton";
import myScaryGirl from "@/../public/myScaryGirl.png";
import { JSX, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getIsDarkMode, isSessionExpired } from "@/utils/helperFunctions";
import { setModeToRedux } from "@/redux/slices/globalSlice";
import { redirect } from "next/navigation";

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
  }, []);
  const setDarkModeProp = () => {
    setModeToRedux(!darkMode);
  };

  return (
    <div className={` dark:bg-darkBackground  ${darkMode && "dark"} slideIn `}>
      <div className="w-screen h-screen bg-white flex justify-center items-center relative dark:bg-darkBackground ">
        <div className="w-[40%] h-[50%]  flex  border p-5 border-black dark:border-white rounded-lg ">
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
