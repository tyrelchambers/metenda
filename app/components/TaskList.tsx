import { Link, useFetcher } from "@remix-run/react";
import { faMinusCircle, faPencil } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Task } from "@prisma/client";

const TaskList = ({ task }: Task) => {
  const fetcher = useFetcher();

  const onChangeHandler = (checked) => {
    fetcher.submit(
      { id: task.id, done: checked, type: "toggleDone" },
      { method: "post" }
    );
  };

  const deleteHandler = () => {
    fetcher.submit({ id: task.id, type: "delete" }, { method: "post" });
  };

  return (
    <li className="flex items-center border-b-[1px] border-b-gray-200 py-4">
      <fetcher.Form>
        <input
          type="checkbox"
          name="done"
          className="mr-4"
          onChange={(e) => onChangeHandler(e.currentTarget.checked)}
          defaultChecked={task.done}
        />
      </fetcher.Form>

      <Link
        to={`/task/${task.id}`}
        className={`w-full flex-1  ${
          task.done ? "font-normal text-gray-500 line-through" : "text-gray-800"
        }`}
      >
        {task.title}
      </Link>

      <div className="flex items-center gap-4">
        <Link to={`/task/${task.id}/edit`}>
          <FontAwesomeIcon
            icon={faPencil}
            className="text-gray-500 transition-all hover:text-green-500"
            style={{ width: "16px" }}
          />
        </Link>
        <fetcher.Form method="delete">
          <button onClick={deleteHandler}>
            <FontAwesomeIcon
              icon={faMinusCircle}
              className="text-gray-500 transition-all hover:text-red-500"
              style={{ width: "16px" }}
            />
          </button>
        </fetcher.Form>
      </div>
    </li>
  );
};

export default TaskList;
