import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popover from "./PopOver";
import PriorityList from "./PriorityList";
import React from "react";
import { faFlag } from "@fortawesome/free-regular-svg-icons";

const TaskPriorityPicker = () => {
  return (
    <Popover
      placement="end"
      triggerLabel={
        <FontAwesomeIcon
          icon={faFlag}
          className="rounded-full p-2 text-gray-500 transition-all hover:bg-gray-100"
          style={{ width: "14px" }}
        />
      }
    >
      <PriorityList />
    </Popover>
  );
};

export default TaskPriorityPicker;
