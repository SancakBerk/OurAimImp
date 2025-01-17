"use client";
import React, { FC, JSX, useState } from "react";
import "./style.css";
import Image from "next/image";

import moonImage from "../../public/moon.png";
import sunImage from "../../public/sun.png";
import { getIsDarkMode } from "../utils/helperFunctions";

interface modeButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  setDarkModeProp: (mode: boolean) => void;
}

const ModeButton: FC<modeButtonProps> = ({
  setDarkModeProp,
  ...props
}): JSX.Element => {
  const [darkMode, setdarkMode] = useState<boolean>(getIsDarkMode());
  const handleMode = (): void => {
    localStorage.setItem("darkMode", JSON.stringify(!darkMode));
    setdarkMode(!darkMode);
    setDarkModeProp(!darkMode);
  };

  return (
    <button
      className={`w-28 h-14 rounded-lg border  ${
        darkMode ? "lightModeBackGround" : "darkModeBackGround"
      } flex ${props.className}  `}
      onClick={handleMode}
    >
      <div className={`w-[50%] h-full p-1 `}>
        <Image
          src={darkMode ? sunImage : moonImage}
          alt="Moon_Sun Images"
          className="h-full  "
        />
      </div>
      <div className={`w-[50%] h-full p-1 flex justify-center items-center `}>
        <p
          className={`${
            darkMode ? "text-yellow-300" : "text-white"
          } font-bold `}
        >
          {darkMode ? "Light" : "Dark"}
        </p>
      </div>
    </button>
  );
};
export default ModeButton;
