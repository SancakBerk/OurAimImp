import { JSX } from "react";
import BouncingCircles from "@/../public/bouncing-circles.svg";

const loadingInterface = (): JSX.Element => {
  return (
    <div className="w-screen h-screen flex justify-center items-center ">
      <span className="loader"></span>
    </div>
  );
};

export default loadingInterface;
