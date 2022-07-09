import { TaskFilters, TaskStatuses } from "~/types";

import React from "react";

const FilterString = ({ filters }: { filters: TaskFilters }) => {
  if (Object.keys(filters).length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      <p className="text-gray-600">by</p>
      {filters.category && (
        <p className="rounded-full border-[1px] border-gray-300 p-2 text-xs">
          category:{" "}
          <span className="text-indigo-500">{filters.category.title}</span>
        </p>
      )}
      {filters.status && (
        <p className="rounded-full border-[1px] border-gray-300 p-2 text-xs">
          status:{" "}
          <span className="text-indigo-500">
            {TaskStatuses[filters.status]}
          </span>
        </p>
      )}
    </div>
  );
};

export default FilterString;
