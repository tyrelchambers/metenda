import DashHeader from "./DashHeader";
import React from "react";

interface IWrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: IWrapperProps) => {
  return (
    <div className="flex min-h-screen w-full gap-10 bg-gray-100 p-4">
      <DashHeader />
      {children}
    </div>
  );
};

export default Wrapper;
