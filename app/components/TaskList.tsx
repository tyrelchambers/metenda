import { Form, Link, useFetcher } from "@remix-run/react";
import { faMinusCircle, faPencil } from "@fortawesome/free-solid-svg-icons";

import CheckBox from "./CheckBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Task } from "@prisma/client";
import TaskStatus from "./TaskStatus";
import { taskStatus } from "~/utils";

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
        <CheckBox
          name="done"
          defaultChecked={task.done}
          onChange={(e) => onChangeHandler(e.currentTarget.checked)}
          checked={task.done}
        />
      </Form>

      <div className="flex flex-1 items-center justify-start gap-4">
        <Link
          to={`/task/${task.id}`}
          className={`  ${
            task.done
              ? "font-normal text-gray-500 line-through"
              : "text-gray-800"
          }`}
        >
          {task.title}
        </Link>
        <TaskStatus status={taskStatus(task)} />
      </div>

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
