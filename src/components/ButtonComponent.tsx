"use client";
import { getIsDarkMode } from "@/utils/helperFunctions";
import React, { JSX, useState } from "react";

interface buttonProps extends React.HTMLAttributes<HTMLButtonElement> {
  text: string;
  classNameProp?: string;
}
export const ButtonComponent: React.FC<buttonProps> = ({
  text,
  classNameProp,
  ...props
}): JSX.Element => {
  const [isDarkMode, setisDarkMode] = useState(getIsDarkMode());

  return (
    <div className={`${isDarkMode && "dark"}`}>
      <button
        onClick={props.onClick}
        className={`text-xl focus:outline-none p-5 rounded-lg  bg-white dark:bg-black  ${classNameProp}`}
      >
        <p className="dark:text-white  "> {text} </p>
      </button>
    </div>
  );
};
