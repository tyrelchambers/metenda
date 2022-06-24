import { TaskStatusProps, TaskStatuses } from "~/types";
import {
  faCheckCircle,
  faClock,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const TaskStatus = ({
  status = TaskStatuses.IN_PROGRESS,
}: {
  status: TaskStatusProps;
}) => {
  if (status === TaskStatuses.DONE) {
    return (
      <span className="flex items-center rounded-full bg-green-100 py-1 px-3 text-xs text-green-500">
        <FontAwesomeIcon
          icon={faCheckCircle}
          style={{ width: "10px" }}
          className="mr-2"
        />{" "}
        done
      </span>
    );
  }
  if (status === TaskStatuses.INCOMPLETE) {
    return (
      <span className="flex items-center rounded-full bg-red-100 py-1 px-3 text-xs text-red-500">
        <FontAwesomeIcon
          icon={faTimes}
          style={{ width: "7px" }}
          className="mr-2"
        />{" "}
        incomplete
      </span>
    );
  }

  return (
    <span className="flex items-center text-gray-500">
      <FontAwesomeIcon
        icon={faClock}
        style={{ width: "10px" }}
        className="mr-2"
      />{" "}
      in progress
    </span>
  );
};

export default TaskStatus;
