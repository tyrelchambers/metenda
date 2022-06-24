import { Category, Task } from "@prisma/client";
import CategoryPill, { CategoryPillSize } from "./CategoryPill";
import { Form, Link, useFetcher } from "@remix-run/react";
import {
  faFlag,
  faPencil,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { format, parseISO } from "date-fns";

import CategoryList from "./CategoryList";
import CheckBox from "./CheckBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pill from "./Pill";
import React from "react";
import TaskListItemActions from "./TaskListItemActions";
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
    <li className="flex  items-start gap-2 border-b-[1px] border-b-gray-200 py-4">
      <CheckBox
        name="done"
        changeHandler={() => onChangeHandler(!task.done)}
        checked={task.done}
      />

      <div className="flex flex-1 flex-col ">
        <div className="flex  items-center justify-start gap-4">
          <Link
            to={`/task/${task.id}`}
            className={`  ${
              task.done
                ? "font-medium text-gray-500 line-through"
                : "font-medium text-gray-800"
            }`}
          >
            {task.title}
          </Link>
          <TaskStatus status={taskStatus(task)} />
        </div>
        <div className="flex rounded-lg py-2">
          <span className="flex gap-2">
            <FontAwesomeIcon
              icon={faFlag}
              style={{ width: "10px" }}
              className="text-gray-400"
            />
            <p className="text-xs text-gray-400">
              {format(parseISO(task.fromDate), "MMMM do, yyyy")}
            </p>
          </span>
        </div>
        <ul className="flex gap-2">
          {task.categories.length > 0 &&
            task.categories.map((c) => (
              <li key={c.id}>
                <CategoryPill data={c.category} size={CategoryPillSize.SMALL} />
              </li>
            ))}
        </ul>
      </div>

      <TaskListItemActions
        task={task}
        markAsIncomplete={() => markAsIncomplete(!task.incomplete)}
      />
    </li>
  );
};

export default TaskList;
