"use client";
import { verticalNavbarType } from "@/types/types";
import React, { JSX, useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import SavingComponent from "./Saving";
import { FaBasketShopping, FaRightFromBracket } from "react-icons/fa6";
import Spending from "./Spending";
import ModeButton from "@/components/modeButton";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setModeToRedux } from "@/redux/slices/globalSlice";
import { ButtonComponent } from "@/components/ButtonComponent";
import { redirect } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";

const VerticalNavbar = (): JSX.Element => {
  const [visibleComponentId, setVisibleComponentId] = useState<number | null>(
    null
  );
  const dispatch = useDispatch();
  const { t } = useLocale();
  const isDarkMode = useSelector(
    (state: RootState) => state.globalSlice.isDarkMode
  );

  const verticalNavbarData: verticalNavbarType[] = [
    {
      id: 1,
      title: t('nav.savings'),
      icon: <FaDollarSign />,
      contentComponent: <SavingComponent />,
    },
    {
      id: 2,
      title: t('nav.expenses'),
      icon: <FaBasketShopping />,
      contentComponent: <Spending />,
    },
  ];

  return (
    <div className={`${isDarkMode && "dark"} relative w-full h-full`}>
      {/* Sidebar */}
      <div className="w-[10vw] h-full fixed top-0 left-0 flex flex-col items-center z-40 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg max-sm:w-full max-sm:h-[8vh] max-sm:flex-row max-sm:justify-between max-sm:px-4">
        {/* Logo/Brand Area */}
        <div className="w-full py-6 flex flex-col justify-center items-center border-b border-gray-200 dark:border-gray-700 max-sm:hidden">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xs font-bold text-center text-gray-800 dark:text-white leading-tight">
            {t('nav.appName').split(' ').map((word: string, i: number) => (
              <span key={i}>{word}<br/></span>
            ))}
          </h1>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 w-full flex flex-col items-center gap-4 pt-8 max-sm:flex-row max-sm:pt-0 max-sm:gap-2">
          {verticalNavbarData.map(
            (eachVerticalNavbarData: verticalNavbarType) => {
              const isActive = visibleComponentId === eachVerticalNavbarData.id;
              return (
                <div
                  key={eachVerticalNavbarData.id}
                  className="w-full px-4 max-sm:px-0 max-sm:w-auto"
                  onMouseEnter={() =>
                    setVisibleComponentId(eachVerticalNavbarData.id)
                  }
                  onMouseLeave={() => setVisibleComponentId(null)}
                >
                  <button
                    onClick={() => {
                      // Mobilde tıklayınca aç/kapat
                      if (window.innerWidth < 640) {
                        setVisibleComponentId(
                          isActive ? null : eachVerticalNavbarData.id
                        );
                      }
                    }}
                    className={`w-full flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200
                      ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                      max-sm:flex-row max-sm:gap-1 max-sm:px-3 max-sm:py-2`}
                  >
                    <span className="text-2xl max-sm:text-xl">
                      {eachVerticalNavbarData.icon}
                    </span>
                    <span className="text-xs font-medium text-center max-sm:text-sm">
                      {eachVerticalNavbarData.title}
                    </span>
                  </button>
                </div>
              );
            }
          )}
        </nav>

        {/* Bottom Actions */}
        <div className="w-full p-4 flex flex-col gap-3 border-t border-gray-200 dark:border-gray-700 max-sm:hidden">
          <div className="flex gap-2">
            <ModeButton
              className="flex-1"
              setDarkModeProp={() => {
                dispatch(setModeToRedux(!isDarkMode));
              }}
            />
            <LanguageSelector className="flex-1" />
          </div>
          <ButtonComponent
            variant="danger"
            className="w-full text-sm"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("session");
              redirect("/Login");
            }}
            text={t('common.logout')}
          />
        </div>

        {/* Mobile Bottom Actions */}
        <div className="hidden max-sm:flex gap-2 items-center">
          <ModeButton
            className="w-auto"
            width="w-10"
            height="h-10"
            setDarkModeProp={() => {
              dispatch(setModeToRedux(!isDarkMode));
            }}
          />
          <LanguageSelector />
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("session");
              redirect("/Login");
            }}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
            title={t('common.logout')}
          >
            <FaRightFromBracket className="text-lg" />
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {visibleComponentId !== null && (
        <div
          className="hidden max-sm:block fixed inset-0 bg-black/50 z-20"
          onClick={() => setVisibleComponentId(null)}
        />
      )}

      {/* Slide-out Panels */}
      {verticalNavbarData.map((eachVerticalNavbarData: verticalNavbarType) => {
        const isVisible = visibleComponentId === eachVerticalNavbarData.id;

        return (
          <div
            key={eachVerticalNavbarData.id}
            onMouseEnter={() =>
              setVisibleComponentId(eachVerticalNavbarData.id)
            }
            onMouseLeave={() => setVisibleComponentId(null)}
            className={`fixed top-0 left-[10vw] w-[70vw] h-screen shadow-2xl
              transition-all duration-300 ease-in-out z-30
              max-sm:left-0 max-sm:top-[8vh] max-sm:w-full max-sm:h-[calc(100vh-8vh)]
              ${
                isVisible
                  ? "translate-x-0 opacity-100 pointer-events-auto"
                  : "-translate-x-full opacity-0 pointer-events-none max-sm:-translate-x-0 max-sm:-translate-y-full"
              }`}
          >
            {eachVerticalNavbarData.contentComponent}
          </div>
        );
      })}
    </div>
  );
};

export default VerticalNavbar;
