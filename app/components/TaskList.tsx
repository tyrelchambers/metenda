import CategoryPill, { CategoryPillSize } from "./CategoryPill";
import { Link, useFetcher } from "@remix-run/react";
import { format, parseISO } from "date-fns";

import CheckBox from "./CheckBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Task } from "@prisma/client";
import TaskListItemActions from "./TaskListItemActions";
import TaskStatus from "./TaskStatus";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { priorities } from "~/constants";
import { taskStatus } from "~/utils";

const TaskList = ({
  task,
  redirectTo = "/agenda",
}: {
  task: Task;
  redirectTo?: string;
}) => {
  const fetcher = useFetcher();

  const onChangeHandler = (checked: boolean) => {
    fetcher.submit(
      { id: task.id, done: String(checked), type: "toggleDone" },
      { method: "post", action: "/agenda" }
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
        <div className="my-2 flex gap-4">
          {priorities[task.priority].icon}
          <span className="flex gap-2">
            <FontAwesomeIcon
              icon={faClock}
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

      <TaskListItemActions task={task} redirectTo={redirectTo} />
    </li>
  );
};

export default TaskList;
