import { Category, Task } from "@prisma/client";

import { TaskRepeatDetails } from "~/types";
import { currentDay } from "~/utils";
import { useState } from "react";

export const useTask = (task?: Task) => {
  const [newTask, setNewTask] = useState<
    Partial<Task & TaskRepeatDetails> | Task
  >(
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
      setSelectedCategories(
        selectedCategories.filter((c) => c.id !== category.id)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
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
