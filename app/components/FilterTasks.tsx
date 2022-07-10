import React, { useState } from "react";
import { TaskFilters, TaskStatuses } from "~/types";

import { Category } from "@prisma/client";
import CategoryPill from "./CategoryPill";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover } from "@mantine/core";
import TaskStatus from "./TaskStatus";
import { faSlidersUp } from "@fortawesome/pro-light-svg-icons";

const FilterTasks = ({
  categories,
  setFilter,
  resetFilters,
}: {
  categories: Category[];
  setFilter: (f: TaskFilters) => void;
  resetFilters?: () => void;
}) => {
  const [opened, setOpened] = useState(true);

  return (
    <div>
      <Popover
        opened={opened}
        onClose={() => setOpened(false)}
        target={
          <button onClick={() => setOpened((o) => !o)}>
            <FontAwesomeIcon
              icon={faSlidersUp}
              style={{ width: "16px" }}
              className="text-indigo-500"
            />
          </button>
        }
        width={260}
        position="bottom"
        withArrow
        placement="end"
      >
        <div className="flex items-center justify-between">
          <p className="font-bold text-gray-800">Filter</p>
          <button
            className="text-sm text-indigo-500"
            onClick={() => resetFilters?.()}
          >
            Reset
          </button>
        </div>
        <hr className="mt-4 mb-4" />
        <div className="flex flex-col">
          <p className=" text-sm font-semibold text-gray-800">Category</p>
          <div className="mt-2 flex flex-col gap-2 overflow-auto">
            {categories.map((category: Category) => (
              <CategoryPill
                key={category.id}
                data={category}
                onClick={() => setFilter({ category })}
                className="!w-full text-center"
              />
            ))}
          </div>
        </div>
        <hr className="mt-4 mb-4" />
        <div className="mt-6 flex flex-col">
          <p className=" text-sm font-semibold text-gray-800">Status</p>
          <div className="mt-2 flex flex-col gap-2 overflow-auto">
            {Object.keys(TaskStatuses).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter({ status: status as TaskStatuses })}
              >
                <TaskStatus status={TaskStatuses[status]} />
              </button>
            ))}
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default FilterTasks;
