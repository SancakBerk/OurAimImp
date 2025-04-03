"use client";
import React, { FC, JSX } from "react";
import "./style.css";
import Image from "next/image";

import moonImage from "../../public/moon.png";
import sunImage from "../../public/sun.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setModeToRedux } from "@/redux/slices/globalSlice";

interface modeButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  width?: string;
  height?: string;
  setDarkModeProp: (mode: boolean) => void;
}

const ModeButton: FC<modeButtonProps> = ({
  height,
  width,
  ...props
}): JSX.Element => {
  const darkMode = useSelector(
    (state: RootState) => state.globalSlice.isDarkMode
  );
  const dispatch = useDispatch();

  const handleMode = (): void => {
    localStorage.setItem("darkMode", JSON.stringify(!darkMode));
    dispatch(setModeToRedux(!darkMode));
  };

  return (
    <button
      className={`h-14 w-14 ${width} ${height}   rounded-lg border  ${
        darkMode ? "lightModeBackGround" : "darkModeBackGround"
      } flex   justify-center items-center   ${props.className}  `}
      onClick={handleMode}
    >
      <div className={`w-[50%] h-full p-1 max-xl:p-0 `}>
        <Image
          src={darkMode ? sunImage : moonImage}
          alt="Moon_Sun Images"
          className="h-full"
        />
      </div>
      <div
        className={`w-[50%] h-full p-1 flex justify-center items-center max-xl:p-0 `}
      >
        <p
          className={`${
            darkMode ? "text-yellow-300" : "text-white"
          } font-bold max:xl:text-sm  `}
        >
          {darkMode ? "Light" : "Dark"}
        </p>
      </div>
    </button>
  );
};
export default ModeButton;
