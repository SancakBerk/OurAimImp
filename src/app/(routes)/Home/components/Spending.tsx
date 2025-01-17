import { verticalNavbarProps } from "@/types/types";
import React, { JSX } from "react";
import { ButtonComponent } from "@/components/ButtonComponent";

const Spending = (): JSX.Element => {
  return (
    <div className={`w-full h-full bg-blue-400  `}>
      <ButtonComponent
        text="Test"
        onClick={() => {
          console.log("Test");
        }}
      />
    </div>
  );
};
export default Spending;
