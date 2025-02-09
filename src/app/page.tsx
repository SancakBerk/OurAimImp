"use client";
import { isSessionExpired } from "@/utils/helperFunctions";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    isSessionExpired();
    redirect("/Home");
  }, []);
};
export default Home;
