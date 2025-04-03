"use client";
import React, { JSX } from "react";
import { motion } from "framer-motion";

interface buttonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  children?: React.ReactNode;
  width?: string;
  height?: string;
  textStyle?: string;
}
export const ButtonComponent: React.FC<buttonProps> = ({
  text,
  textStyle,
  width,
  height,
  children,
  ...props
}): JSX.Element => {
  return (
    <motion.button
      type={props.type}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={props.onClick}
      className={`text-xl focus:outline-none p-2 rounded-lg   flex justify-center items-center bg-white   dark:bg-darkBackground border border-black dark:border-white max-sm:p-1 ${width} ${height} ${props.className}
        max-xl:text-md
        max-sm:text-sm
        `}
    >
      {children ? (
        children
      ) : (
        <p className={`dark:text-white   ${textStyle} max-sm:text-xs  `}>
          {" "}
          {text}
        </p>
      )}
    </motion.button>
  );
};
