import React from "react";

const Main = ({
  children,
  className = "",
}: {
  children: JSX.Element | JSX.Element[];
  className?: string;
}) => {
  return (
    <main
      className={`flex h-fit w-full max-w-2xl flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg ${className}`}
    >
      {children}
    </main>
  );
};

export default Main;
