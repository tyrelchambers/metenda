import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Priority } from "~/components/PriorityList";
import { faFlag } from "@fortawesome/free-solid-svg-icons";

export const priorities = {
  priority1: {
    label: "Priority 1",
    value: Priority.PRIORITY1,
    icon: (
      <FontAwesomeIcon
        icon={faFlag}
        className="text-red-500"
        style={{ width: "12px" }}
      />
    ),
  },
  priority2: {
    label: "Priority 2",
    value: Priority.PRIORITY2,
    icon: (
      <FontAwesomeIcon
        icon={faFlag}
        className="text-orange-500"
        style={{ width: "12px" }}
      />
    ),
  },
  priority3: {
    label: "Priority 3",
    value: Priority.PRIORITY3,
    icon: (
      <FontAwesomeIcon
        icon={faFlag}
        className="text-green-500"
        style={{ width: "12px" }}
      />
    ),
  },
  priority4: {
    label: "Priority 4",
    value: Priority.PRIORITY4,
    icon: (
      <FontAwesomeIcon
        icon={faFlag}
        className="text-gray-400"
        style={{ width: "12px" }}
      />
    ),
  },
};
