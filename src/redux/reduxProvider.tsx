"use client";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { LocaleProvider } from "@/contexts/LocaleContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LocaleProvider>
        {children}
      </LocaleProvider>
    </Provider>
  );
}
