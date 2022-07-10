import { TaskFilters, TaskStatuses } from "~/types";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";

const FilterString = ({
  filters,
  removeFilter,
}: {
  filters: TaskFilters;
  removeFilter: (t: TaskFilters) => void;
}) => {
  if (Object.keys(filters).length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      <p className="text-gray-600">by</p>
      {filters.category && (
        <div className="flex items-center gap-2 rounded-full border-[1px] border-gray-300 p-2 text-xs">
          <button type="button" onClick={() => removeFilter("category")}>
            <FontAwesomeIcon icon={faTimes} className="hover:text-red-500" />
          </button>
          <p className="text-xs">
            category:{" "}
            <span className="text-indigo-500">{filters.category.title}</span>
          </p>
        </div>
      )}
      {filters.status && (
        <div className="flex items-center gap-2 rounded-full border-[1px] border-gray-300 p-2 text-xs">
          <button onClick={() => removeFilter("status")}>
            <FontAwesomeIcon icon={faTimes} className="hover:text-red-500" />
          </button>
          <p>
            status:{" "}
            <span className="text-indigo-500">
              {TaskStatuses[filters.status]}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default FilterString;
