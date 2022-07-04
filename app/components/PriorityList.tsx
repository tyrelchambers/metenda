import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RadioGroup } from "@headlessui/react";
import React from "react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { priorities } from "~/constants";

export enum Priority {
  PRIORITY1 = "priority1",
  PRIORITY2 = "priority2",
  PRIORITY3 = "priority3",
  PRIORITY4 = "priority4",
}

interface Props {
  currentPriority: string;
  setPriority: (priority: string) => void;
}

const PriorityList = ({ currentPriority, setPriority }: Props) => {
  return (
    <RadioGroup
      value={currentPriority}
      onChange={setPriority}
      className="flex flex-col gap-4"
    >
      {Object.values(priorities).map((p) => (
        <RadioGroup.Option key={p.value} value={p.value} className="w-full">
          {({ checked }) => (
            <div
              className={`0 flex w-full cursor-pointer items-center justify-between text-gray-600 ${
                checked ? "text-indigo-500 " : ""
              } `}
            >
              <div className="flex items-center gap-4">
                {p.icon}
                <p className=" text-sm text-gray-700">{p.label}</p>
              </div>
              {checked && <FontAwesomeIcon icon={faCheck} />}
            </div>
          )}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  );
};

export default PriorityList;
