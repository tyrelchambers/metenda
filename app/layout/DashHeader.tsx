import DashNav from "./DashNav";
import { Link } from "@remix-run/react";
import React from "react";

const DashHeader = () => {
  return (
    <header className="sticky top-4 h-screen w-full max-w-[300px] rounded-3xl bg-gray-800 p-4 shadow-lg">
      <h2 className="text-xl tracking-wider text-gray-100">MetaClimb</h2>
      <nav className="flex flex-col">
        <Link
          to="/task/new"
          className="mt-6 mb-2 w-full rounded-lg bg-indigo-500 p-2 text-center text-white transition-all hover:bg-indigo-600"
        >
          New task
        </Link>
        <Link
          to="/category/new"
          className="mb-6 w-full rounded-lg border-2 border-gray-100 p-2 text-center text-gray-200 transition-all hover:bg-gray-200 hover:text-gray-800"
        >
          New category
        </Link>
        <hr className="mb-6 border-gray-600" />
        <DashNav />
      </nav>
    </header>
  );
};

export default DashHeader;
