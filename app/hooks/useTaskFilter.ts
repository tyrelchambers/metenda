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

  return { filters, setFilter, resetFilters };
};
