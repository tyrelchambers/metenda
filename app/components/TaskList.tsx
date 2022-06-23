import { Form, Link, useFetcher } from "@remix-run/react";
import { faMinusCircle, faPencil } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Task } from "@prisma/client";

const TaskList = ({ task }: { task: Task }) => {
  const fetcher = useFetcher();

  const onChangeHandler = (checked: boolean) => {
    fetcher.submit(
      { id: task.id, done: String(checked), type: "toggleDone" },
      { method: "post" }
    );
  };

  return (
    <li className="flex items-center border-b-[1px] border-b-gray-200 py-4">
      <Form action={`/task/${task.id}/edit`} method="patch">
        <input
          type="checkbox"
          name="done"
          className="mr-4"
          onChange={(e) => onChangeHandler(e.currentTarget.checked)}
          defaultChecked={task.done}
        />
      </Form>

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
        <Form method="delete" action={`/task/${task.id}/delete`}>
          <button type="submit">
            <FontAwesomeIcon
              icon={faMinusCircle}
              className="text-gray-500 transition-all hover:text-red-500"
              style={{ width: "16px" }}
            />
            <input type="hidden" name="id" value={task.id} />
          </button>
        </Form>
      </div>
    </li>
  );
};

export default TaskList;
