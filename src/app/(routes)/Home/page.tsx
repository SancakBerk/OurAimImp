"use client";
import { getIsDarkMode } from "@/utils/helperFunctions";
import { JSX, ReactNode, useEffect, useState } from "react";
import VerticalNavbar from "./components/VerticalNavbar";
import Expenses from "./components/Expenses";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import UpdateAddPopUp from "./components/UpdateAddPopUp";
import ConfirmDeletePopUp from "./components/ConfirmDeletePopUp";

const HomePage = (): JSX.Element => {
  const homePageSlice = useSelector((state: RootState) => state.homePageSlice);
  const isDarkMode = useSelector(
    (state: RootState) => state.globalSlice.isDarkMode
  );
  return (
    <div className={`${isDarkMode && "dark"}`}>
      <div className="w-screen h-screen flex relative">
        <div className="w-[10%] h-full">
          <VerticalNavbar />
        </div>
        <div className="w-full h-screen">
          <Expenses />
        </div>
        {homePageSlice.isPopupOpen.isPopupOpen && <UpdateAddPopUp />}
        {homePageSlice.deletePopUpConfirmation.showDeletePopUp && (
          <ConfirmDeletePopUp />
        )}
      </div>
    </div>
  );
};

export default HomePage;
