import { Form, Link } from "@remix-run/react";

import DashNav from "./DashNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const DashHeader = () => {
  return (
    <header className="sticky top-4 flex h-full w-full max-w-[300px] flex-col justify-between rounded-3xl bg-gray-800 p-4 shadow-lg">
      <nav className="flex flex-col">
        <h2 className="text-xl tracking-wider text-gray-100">MetaClimb</h2>
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
      <Form action="/logout" method="post">
        <button
          type="submit"
          className="flex items-center gap-6  text-gray-400 transition-all hover:text-white"
        >
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            style={{ width: "17px" }}
          />{" "}
          Sign out
        </button>
      </Form>
    </header>
  );
};

export default DashHeader;
