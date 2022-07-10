import {
  faCheckCircle,
  faClock,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { TaskStatuses } from "~/types";

const pillClasses = "flex items-center rounded-full py-1 px-3 text-xs";

const TaskStatus = ({
  status = TaskStatuses.IN_PROGRESS,
}: {
  status: TaskStatuses;
}) => {
  if (status === TaskStatuses.DONE) {
    return (
      <span className={`bg-green-100  text-green-500 ${pillClasses}`}>
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
      <span className={`bg-red-100  text-red-500 ${pillClasses}`}>
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
    <span className={`bg-gray-100 text-gray-500 ${pillClasses}`}>
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
