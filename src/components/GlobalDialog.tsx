import { globalDialogEachButtonType } from "@/types/types";
import React from "react";

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
    <>
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"></div>
      
      {/* Modal Container */}
      <div
        className={`w-full h-full z-[60] fixed top-0 left-0 flex flex-col justify-center items-center p-4 ${props.className}`}
      >
        <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
          {/* Header */}
          <div className="px-6 sm:px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
            <div className="flex flex-col justify-center items-center h-full">
              {children}
            </div>
          </div>

          {/* Footer with Buttons */}
          {buttons && buttons.length > 0 && (
            <div className="px-6 sm:px-8 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex gap-3 justify-end">
                {buttons.map((eachButton: globalDialogEachButtonType, index) => {
                  const isCancel = eachButton.text.toLowerCase().includes('iptal');
                  return (
                    <button
                      key={index}
                      onClick={eachButton.onClick}
                      className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                        isCancel
                          ? 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                          : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
                      }`}
                    >
                      {eachButton.text}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GlobalDialog;
