import { verticalNavbarType } from "@/types/types";
import React, { JSX, useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import SavingComponent from "./Saving";
import { FaBasketShopping } from "react-icons/fa6";
import Spending from "./Spending";
import ModeButton from "@/components/modeButton";
import { getIsDarkMode } from "@/utils/helperFunctions";

const VerticalNavbar = (): JSX.Element => {
  const [visibleComponentId, setVisibleComponentId] = useState<number | null>(
    null
  );
  const [isDarkMode, setisDarkMode] = useState(getIsDarkMode());

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
      <div className="w-[10vw] fixed top-0 left-0 bottom-0 flex flex-col pt-40 items-center bg-gray-300 gap-y-10 z-50 dark:bg-black ">
        {verticalNavbarData.map(
          (eachVerticalNavbarData: verticalNavbarType) => {
            return (
              <div key={eachVerticalNavbarData.id}>
                <div
                  onMouseEnter={() =>
                    setVisibleComponentId(eachVerticalNavbarData.id)
                  }
                  onMouseLeave={() => setVisibleComponentId(null)}
                  className="w-full h-16 flex items-center text-xl text-white p-5 hover:bg-slate-600 rounded relative z-50"
                >
                  {eachVerticalNavbarData.icon}
                  <p className="ml-3">{eachVerticalNavbarData.title}</p>
                </div>
              </div>
            );
          }
        )}
        <div className="absolute bottom-[10%] w-full  flex justify-center items-center  ">
          <ModeButton
            setDarkModeProp={() => {
              setisDarkMode(!isDarkMode);
            }}
          />
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
            className={` absolute top-0 left-[10vw] w-[70vw] h-screen bg-white text-black p-10 shadow-lg transition-all duration-500 ease-in-out ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
            }`}
            style={{ zIndex: 40 }} // Vertical Navbar'ın arkasında olacak şekilde z-index ayarlandı
          >
            {eachVerticalNavbarData.contentComponent}
          </div>
        );
      })}
    </div>
  );
};

export default VerticalNavbar;
