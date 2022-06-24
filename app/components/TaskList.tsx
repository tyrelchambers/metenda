import { Form, Link, useFetcher } from "@remix-run/react";
import { faPencil, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";

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

  const markAsIncomplete = (incomplete: boolean) => {
    fetcher.submit(
      { id: task.id, incomplete: String(incomplete), type: "markAsIncomplete" },
      { method: "post" }
    );
  };

  return (
    <li className="flex  items-center border-b-[1px] border-b-gray-200 py-4">
      <CheckBox
        name="done"
        changeHandler={() => onChangeHandler(!task.done)}
        checked={task.done}
      />

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
        <FontAwesomeIcon
          icon={faTimes}
          className="text-red-300"
          title="Mark as incomplete"
          style={{ width: "13px" }}
          onClick={() => markAsIncomplete(!task.incomplete)}
        />
        <span className="h-4 w-[1px] bg-gray-400"></span>
        <Link to={`/task/${task.id}/edit`}>
          <FontAwesomeIcon
            icon={faPencil}
            className="text-gray-500 transition-all hover:text-green-500"
            style={{ width: "13px" }}
          />
        </Link>
        <Form method="delete" action={`/task/${task.id}/delete`}>
          <button type="submit">
            <FontAwesomeIcon
              icon={faTrash}
              className="text-gray-500 transition-all hover:text-red-500"
              style={{ width: "13px" }}
            />
            <input type="hidden" name="id" value={task.id} />
          </button>
        </Form>
      </div>
    </li>
  );
};

export default TaskList;
