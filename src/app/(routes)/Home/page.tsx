"use client";
import { getIsDarkMode } from "@/utils/helperFunctions";
import { JSX, ReactNode, useState } from "react";
import VerticalNavbar from "./components/VerticalNavbar";
import Expenses from "./components/Expenses";

const HomePage = (): JSX.Element => {
  const [isDarkMode, setIsDarkMode] = useState(getIsDarkMode());
  return (
    <div className={`${isDarkMode && "dark"}`}>
      <div className="w-screen h-screen">
        <div className="w-[10%] h-screen">
          <VerticalNavbar />
        </div>
        <div className="w-full h-screen">
          <Expenses />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
