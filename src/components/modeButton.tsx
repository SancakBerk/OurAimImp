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
      className={`h-10 w-10 ${width} ${height} rounded-lg border transition-all duration-200 ${
        darkMode 
          ? "bg-gray-800 border-gray-700 hover:bg-gray-700" 
          : "bg-gray-100 border-gray-300 hover:bg-gray-200"
      } flex justify-center items-center ${props.className}`}
      onClick={handleMode}
      title={darkMode ? "Light Mode" : "Dark Mode"}
    >
      <div className="w-6 h-6">
        <Image
          src={darkMode ? sunImage : moonImage}
          alt={darkMode ? "Light Mode" : "Dark Mode"}
          className="w-full h-full object-contain"
        />
      </div>
    </button>
  );
};
export default ModeButton;
