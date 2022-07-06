import DashHeader from "./DashHeader";
import React from "react";

interface IWrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: IWrapperProps) => {
  return (
    <div className="wrapper flex w-full  bg-gray-100">
      <DashHeader />
      <div className="w-full p-6">{children}</div>
    </div>
  );
};

export default Wrapper;
