import { verticalNavbarType } from "@/types/types";
import React, { JSX, useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import SavingComponent from "./Saving";
import { FaBasketShopping } from "react-icons/fa6";
import Spending from "./Spending";
import ModeButton from "@/components/modeButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setModeToRedux } from "@/redux/slices/globalSlice";
import { ButtonComponent } from "@/components/ButtonComponent";
import { redirect } from "next/navigation";

const VerticalNavbar = (): JSX.Element => {
  const [visibleComponentId, setVisibleComponentId] = useState<number | null>(
    null
  );
  const dispatch = useDispatch();
  const isDarkMode = useSelector(
    (state: RootState) => state.globalSlice.isDarkMode
  );

  const verticalNavbarData: verticalNavbarType[] = [
    {
      id: 1,
      title: "Birikim",
      icon: <FaDollarSign />,
      contentComponent: <SavingComponent />,
    },
    {
      id: 2,
      title: "Harcamalar",
      icon: <FaBasketShopping />,
      contentComponent: <Spending />,
    },
  ];

  return (
    <div className={` ${isDarkMode && "dark"} relative w-full h-full`}>
      <div className="w-[10vw] h-[100%] fixed top-0 left-0  flex flex-col pt-40 items-center gap-y-10 z-40  border-r-2 border-black dark:border-white opacity-90  max-sm:w-full max-sm:h-[10vh] max-sm:flex-row max-sm:p-4 max-sm:gap-x-2  ">
        {verticalNavbarData.map(
          (eachVerticalNavbarData: verticalNavbarType) => {
            return (
              <div
                className="w-full p-4    max-sm:h-full max-sm:w-auto max-sm:p-0 dark:border-white rounded-md  "
                key={eachVerticalNavbarData.id}
              >
                <div
                  onMouseEnter={() =>
                    setVisibleComponentId(eachVerticalNavbarData.id)
                  }
                  onMouseLeave={() => setVisibleComponentId(null)}
                  className="w-full justify-center bg-white gap-2  dark:bg-opacity-0 h-16 flex bg-opacity-60 items-center text-xl text-white p-5 dark:hover:border rounded relative z-50 max-2xl:flex-col  max-xl:text-sm max-sm:h-full  "
                >
                  <p className=" text-black dark:text-white">
                    {" "}
                    {eachVerticalNavbarData.icon}
                  </p>

                  <p className=" text-black dark:text-white cursor-default  e">
                    {eachVerticalNavbarData.title}
                  </p>
                </div>
              </div>
            );
          }
        )}
        <div className="absolute bottom-[10%] w-[100%]  flex justify-center items-center flex-col gap-y-10 max-sm:top-0    max-sm:right-0  max-sm:bottom-auto max-sm:w-[40%] max-sm:h-[10vh] max-sm:flex-row  max-sm:gap-x-4  ">
          <ModeButton
            className="w-[70%] max-sm:w-20 "
            setDarkModeProp={() => {
              dispatch(setModeToRedux(!isDarkMode));
            }}
          />
          <ButtonComponent
            parentClassName="w-[70%] max-sm:w-auto max-sm:h-14 "
            className="bg-opacity-60 max-sm:h-14 "
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("session");
              redirect("/Login");
            }}
            text="Çıkış"
          ></ButtonComponent>
        </div>
      </div>
      {verticalNavbarData.map((eachVerticalNavbarData: verticalNavbarType) => {
        const isVisible = visibleComponentId === eachVerticalNavbarData.id;

        return (
          <div
            key={eachVerticalNavbarData.id}
            onMouseEnter={() =>
              setVisibleComponentId(eachVerticalNavbarData.id)
            }
            onMouseLeave={() => setVisibleComponentId(null)}
            className={` fixed top-0 left-[10vw] w-[70vw] h-screen  text-black  shadow-lg transition-all duration-500 ease-in-out max-sm:left-0  max-sm:z-50 max-sm:w-full max-sm:h-[80%] ${
              isVisible
                ? " opacity-100 max-sm:translate-y-0   "
                : "  opacity-0 max-sm:-translate-y-full"
            } max-sm:translate-x-0 max-sm:opacity-100  `}
          >
            {eachVerticalNavbarData.contentComponent}
          </div>
        );
      })}
    </div>
  );
};

export default VerticalNavbar;
