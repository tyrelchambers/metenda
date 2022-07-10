import { TaskFilters } from "~/types";
import { useState } from "react";

export const useTaskFilter = () => {
  const [filters, setFilters] = useState<TaskFilters | {}>({});

  const setFilter = (filter) => {
    setFilters({ ...filters, ...filter });
  };

  const resetFilters = () => {
    setFilters({});
  };

  const removeFilter = (filter: keyof TaskFilters) => {
    const clone = { ...filters };
    delete clone[filter];
    setFilters(clone);
  };

  return { filters, setFilter, resetFilters, removeFilter };
};
