import React, { useState } from "react";
import { faCheck, faFlag } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RadioGroup } from "@headlessui/react";

const priorities: { label: string; value: string; icon: React.ReactElement }[] =
  [
    {
      label: "Priority 1",
      value: "priority1",
      icon: (
        <FontAwesomeIcon
          icon={faFlag}
          className="text-red-500"
          style={{ width: "12px" }}
        />
      ),
    },
    {
      label: "Priority 2",
      value: "priority2",
      icon: (
        <FontAwesomeIcon
          icon={faFlag}
          className="text-orange-500"
          style={{ width: "12px" }}
        />
      ),
    },
    {
      label: "Priority 3",
      value: "priority3",
      icon: (
        <FontAwesomeIcon
          icon={faFlag}
          className="text-green-500"
          style={{ width: "12px" }}
        />
      ),
    },
    {
      label: "Priority 4",
      value: "priority4",
      icon: (
        <FontAwesomeIcon
          icon={faFlag}
          className="text-gray-500"
          style={{ width: "12px" }}
        />
      ),
    },
  ];

const PriorityList = () => {
  let [plan, setPlan] = useState("priority4");

  return (
    <RadioGroup value={plan} onChange={setPlan} className="flex flex-col gap-4">
      {priorities.map((p) => (
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
