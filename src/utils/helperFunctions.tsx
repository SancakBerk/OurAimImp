import { useDispatch } from "react-redux";
import { redirect } from "next/navigation";

export const getIsDarkMode = (): boolean => {
  if (typeof window !== "undefined") {
    // localStorage yalnızca client tarafında erişilebilir
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    return isDarkMode ? true : false;
  }
  return false; // Server tarafında varsayılan olarak false dönebilir
};

export const isSessionExpired = () => {
  const session = localStorage.getItem("session");
  if (session === null) redirect("/Login");
  const sessionObj = JSON.parse(session);
  if (new Date(sessionObj.systemExpiresDate) < new Date())
    return redirect("/Login");
  return false;
};
