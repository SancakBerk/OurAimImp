"use client";
import { RootState } from "@/redux/store";
import React, { JSX } from "react";
import { useSelector } from "react-redux";

interface buttonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  parentClassName?: string;
  text?: string;
  children?: React.ReactNode;
  textStyle?: string;
}
export const ButtonComponent: React.FC<buttonProps> = ({
  parentClassName,
  text,
  textStyle,
  children,
  ...props
}): JSX.Element => {
  const isDarkMode = useSelector(
    (state: RootState) => state.globalSlice.isDarkMode
  );
  return (
    <div className={`${isDarkMode ? "dark" : ""} ${parentClassName} m-2 `}>
      <button
        type={props.type}
        onClick={props.onClick}
        className={`text-xl focus:outline-none p-2 rounded-lg w-full  bg-white   dark:bg-darkBackground border border-black dark:border-white  ${props.className}  `}
      >
        {children ? (
          children
        ) : (
          <p className={`dark:text-white   ${textStyle}  `}> {text} </p>
        )}
      </button>
    </div>
  );
};
