"use client";
import { RootState } from "@/redux/store";
import { getIsDarkMode } from "@/utils/helperFunctions";
import React, { JSX, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface buttonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  parentClassName?: string;
  text: string;
}
export const ButtonComponent: React.FC<buttonProps> = ({
  parentClassName,
  text,
  ...props
}): JSX.Element => {
  const isDarkMode = useSelector(
    (state: RootState) => state.globalSlice.isDarkMode
  );
  return (
    <div className={`${isDarkMode ? "dark" : ""} ${parentClassName}`}>
      <button
        type={props.type}
        onClick={props.onClick}
        className={`text-xl focus:outline-none p-2 rounded-lg w-full  bg-white dark:bg-darkBackground border `}
      >
        <p className="dark:text-white  "> {text} </p>
      </button>
    </div>
  );
};
