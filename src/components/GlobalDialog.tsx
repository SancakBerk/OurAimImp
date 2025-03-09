import { globalDialogEachButtonType } from "@/types/types";
import React from "react";
import { ButtonComponent } from "./ButtonComponent";

interface globalDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  buttons?: globalDialogEachButtonType[];
  title: string;
}
const GlobalDialog: React.FC<globalDialogProps> = ({
  children,
  title,
  buttons,
  ...props
}) => {
  return (
    <div
      className={`w-full h-full z-50 fixed top-0 left-0  flex flex-col justify-center items-center bg-white dark:bg-darkBackground ${props.className} `}
    >
      <div className=" w-[70%] h-[70%] bg-white border rounded-md border-black dark:bg-darkBackground dark:text-white flex flex-col justify-center items-center dark:border dark:border-white p-10 ">
        <div className="w-full h-[15%] ">
          <span className="w-full h-[15%] font-semibold text-xl max-sm:text-sm ">
            {" "}
            {title}{" "}
          </span>
        </div>
        <div className="  w-full h-[75%] flex flex-col justify-center items-center     ">
          {children}
        </div>
        <div className="w-full h-[10%] flex justify-end items-center  ">
          {buttons &&
            buttons.map((eachButton: globalDialogEachButtonType, index) => {
              return (
                <ButtonComponent key={index} onClick={eachButton.onClick}>
                  {eachButton.text}
                </ButtonComponent>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default GlobalDialog;
