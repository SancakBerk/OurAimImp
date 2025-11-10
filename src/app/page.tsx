"use client";
import { isSessionExpired } from "@/utils/helperFunctions";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { getCurrentExchangeRates } from "../services/globalService";

const Home = () => {
  useEffect(() => {
    if (!isSessionExpired()) {
      redirect("/Home");
    }
    redirect("/Login");
  }, []);
};
export default Home;
