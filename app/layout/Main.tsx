import React from "react";

const Main = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <main className="flex h-fit w-full max-w-2xl flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg">
      {children}
    </main>
  );
};

export default Main;
