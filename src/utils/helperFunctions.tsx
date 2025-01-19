import { useDispatch } from "react-redux";

export const getIsDarkMode = (): boolean => {
  if (typeof window !== "undefined") {
    // localStorage yalnızca client tarafında erişilebilir
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    return isDarkMode ? true : false;
  }
  return false; // Server tarafında varsayılan olarak false dönebilir
};
