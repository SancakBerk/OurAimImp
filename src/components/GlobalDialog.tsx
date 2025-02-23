import React from "react";

interface globalDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}
const GlobalDialog: React.FC<globalDialogProps> = ({
  children,
  title,
  ...props
}) => {
  return (
    <div
      className={`w-screen h-screen z-50 fixed top-0 left-0  flex justify-center items-center ${props.className} `}
    >
      <div className=" w-[70%] h-[70%] bg-white dark:bg-darkBackground dark:text-white flex flex-col justify-center items-center dark:border dark:border-white ">
        <div className="w-full h-[10%] flex justify-center items-center">
          <span className=""> {title} </span>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default GlobalDialog;
