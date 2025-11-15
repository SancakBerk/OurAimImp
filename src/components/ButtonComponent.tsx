"use client";
import React, { JSX } from "react";
import { motion } from "framer-motion";

interface buttonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  children?: React.ReactNode;
  width?: string;
  height?: string;
  textStyle?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export const ButtonComponent: React.FC<buttonProps> = ({
  text,
  textStyle,
  width,
  height,
  children,
  variant = "secondary",
  ...props
}): JSX.Element => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 dark:border-blue-500";
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white border-red-600 dark:border-red-500";
      case "ghost":
        return "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent";
      case "secondary":
      default:
        return "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600";
    }
  };

  return (
    <motion.button
      type={props.type}
      disabled={props.disabled}
      whileHover={{ scale: props.disabled ? 1 : 1.02 }}
      whileTap={{ scale: props.disabled ? 1 : 0.98 }}
      onClick={props.onClick}
      className={`
        px-4 py-2.5 rounded-lg font-medium
        flex justify-center items-center
        border transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantClasses()}
        ${width || ""}
        ${height || ""}
        ${props.className || ""}
      `}
    >
      {children ? (
        children
      ) : (
        <span className={`${textStyle || ""}`}>{text}</span>
      )}
    </motion.button>
  );
};
