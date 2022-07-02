import { Category, Task } from "@prisma/client";

import { currentDay } from "~/utils";
import { useState } from "react";

export const useTask = (task?: Task) => {
  const [newTask, setNewTask] = useState<Partial<Task>>(
    task || {
      title: "",
      notes: "",
      fromDate: currentDay,
      toDate: currentDay,
    }
  );

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const isActiveCategory = (category: Category) =>
    selectedCategories.includes(category);

  const categoriesHandler = (category: Category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...category]);
    }
  };

  return {
    newTask,
    setNewTask,
    categoriesHandler,
    isActiveCategory,
    selectedCategories,
  };
};
