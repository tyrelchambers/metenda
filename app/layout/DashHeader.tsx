import { Form, Link } from "@remix-run/react";
import React, { useState } from "react";
import {
  faArrowRightFromBracket,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import DashNav from "./DashNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover } from "@mantine/core";

const DashHeader = () => {
  const [opened, setOpened] = useState(false);

  return (
    <header className="sticky top-0 flex h-full w-full max-w-[300px] flex-col justify-between overflow-auto bg-gray-200 p-6">
      <nav className="flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Metenda</h2>
          <Popover
            opened={opened}
            onClose={() => setOpened(false)}
            target={
              <button
                onClick={() => setOpened((o) => !o)}
                className="flex h-10 w-10 items-center justify-center rounded-full border-[1px] border-gray-400 p-2 text-gray-600 transition-all hover:border-indigo-500 hover:bg-indigo-500 hover:text-white"
              >
                <FontAwesomeIcon style={{ width: "10px" }} icon={faPlus} />
              </button>
            }
            width={260}
            position="bottom"
            withArrow
            placement="end"
          >
            <div className="flex flex-col gap-4">
              <Link
                to="/task/new"
                className=" w-full rounded-lg bg-indigo-500 p-2 text-center text-white transition-all hover:bg-indigo-600"
              >
                New task
              </Link>
              <Link
                to="/category/new"
                className=" w-full rounded-lg border-2 border-gray-400 p-2 text-center text-gray-600 transition-all hover:bg-white hover:text-gray-800"
              >
                New category
              </Link>
            </div>
          </Popover>
        </div>

        <hr className="mb-6 border-gray-300" />
        <DashNav />
      </nav>
      <Form action="/logout" method="post">
        <button
          type="submit"
          className="hover:text-text-gray-800 flex items-center  gap-6 text-gray-600 transition-all"
          name="logout"
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
