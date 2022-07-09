import { Form, Link, useFetcher } from "@remix-run/react";
import React, { useState } from "react";
import {
  faEllipsis,
  faPencil,
  faTimes,
  faTrash,
} from "@fortawesome/pro-light-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover } from "@mantine/core";
import { Task } from "@prisma/client";

interface Props {
  task: Task;
  redirectTo?: string;
}

const TaskListItemActions = ({ task, redirectTo }: Props) => {
  const [opened, setOpened] = useState<boolean>(false);

  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      target={
        <button
          onClick={() => setOpened((o) => !o)}
          className="w-fit"
          type="button"
        >
          <FontAwesomeIcon icon={faEllipsis} className="text-2xl" />
        </button>
      }
      width={260}
      position="bottom"
      withArrow
      placement="end"
      className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-gray-200"
    >
      <Form
        action={`/task/${task.id}/edit`}
        method="patch"
        className="flex w-full flex-col gap-4"
      >
        <Link
          to={`/task/${task.id}/edit`}
          className="w-full text-sm text-gray-500 transition-all  hover:text-indigo-500"
        >
          <FontAwesomeIcon
            icon={faPencil}
            className="mr-4  "
            style={{ width: "13px" }}
          />
          Edit
        </Link>
        <button
          className="flex w-full items-center justify-start text-sm text-gray-500 transition-all  hover:text-indigo-500"
          type="submit"
          name="_action"
          value="check_incomplete"
        >
          <FontAwesomeIcon icon={faTimes} className="mr-4" /> Set as incomplete
          <input type="hidden" name="incomplete" value={!task.incomplete} />
        </button>
        <hr />
        <button
          type="submit"
          data-testid="delete-task"
          className="flex w-full justify-start text-sm text-gray-500 transition-all hover:text-red-500"
          name="_action"
          value="delete"
        >
          <FontAwesomeIcon
            icon={faTrash}
            className="mr-4"
            style={{ width: "13px" }}
          />
          Delete
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="redirectTo" value={redirectTo} />
        </button>
      </Form>
    </Popover>
  );
};

export default TaskListItemActions;
