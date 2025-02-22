import { JSX } from "react";

const loadingInterface = (): JSX.Element => {
  return (
    <div className="w-screen h-screen flex justify-center items-center ">
      <span className="loader"></span>
    </div>
  );
};

export default loadingInterface;
