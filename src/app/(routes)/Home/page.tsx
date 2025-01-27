"use client";
import { getIsDarkMode, isSessionExpired } from "@/utils/helperFunctions";
import { JSX, ReactNode, useEffect, useState } from "react";
import VerticalNavbar from "./components/VerticalNavbar";
import Expenses from "./components/Expenses";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import UpdateAddPopUp from "./components/UpdateAddPopUp";
import ConfirmDeletePopUp from "./components/ConfirmDeletePopUp";
import { setUserIdToRedux } from "@/redux/slices/globalSlice";
import { localStorageSessionType } from "@/types/types";

const HomePage = (): JSX.Element => {
  const homePageSlice = useSelector((state: RootState) => state.homePageSlice);
  const globalSlice = useSelector((state: RootState) => state.globalSlice);
  const isDarkMode = useSelector(
    (state: RootState) => state.globalSlice.isDarkMode
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isSessionExpired()) {
      var localStorageData = localStorage.getItem("session");
      var session = JSON.parse(localStorageData!) as localStorageSessionType;
      dispatch(setUserIdToRedux(session.userId));
    }
  }, []);
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
