"use client";
import { RootState } from "@/redux/store";
import { getIsDarkMode } from "@/utils/helperFunctions";
import React, { JSX, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface buttonProps extends React.HTMLAttributes<HTMLButtonElement> {
  text: string;
}
export const ButtonComponent: React.FC<buttonProps> = ({
  text,
  ...props
}): JSX.Element => {
  const isDarkMode = useSelector(
    (state: RootState) => state.globalSlice.isDarkMode
  );
  return (
    <div className={`${isDarkMode ? "dark" : ""} ${props.className}`}>
      <button
        onClick={props.onClick}
        className={`text-xl focus:outline-none p-2 rounded-lg  bg-white dark:bg-black border `}
      >
        <p className="dark:text-white  "> {text} </p>
      </button>
    </div>
  );
};
