import { Category, Task } from "@prisma/client";
import { CommonFormData, TaskFilters, TaskStatuses } from "./types";
import { endOfWeek, startOfWeek } from "date-fns";

import type { User } from "~/models/user.server";
import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function getWeekdays(date: Date) {
  return {
    start: startOfWeek(date),
    end: endOfWeek(date),
  };
}

export const currentDay = new Date(Date.now());

export function getCommonFormData(
  formData: FormData,
  keys: string[]
): Partial<CommonFormData> {
  const data: Partial<CommonFormData> = {};
  for (let index = 0; index < keys.length; index++) {
    const element = keys[index];
    if (formData.has(element)) {
      data[element] = formData.get(element);
    }
  }
  return data;
}

export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let index = 0; index < 6; index++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const arrayFromWeeks = (week: number) => {
  const arr = [];
  for (let index = 0; index < week; index++) {
    arr.push(index + 1);
  }
  return arr;
};

export const taskStatus = (task: Task): TaskStatuses => {
  if (task.done) return TaskStatuses.DONE;
  if (task.incomplete || (task.toDate && task.toDate > currentDay)) {
    return TaskStatuses.INCOMPLETE;
  }
  return TaskStatuses.IN_PROGRESS;
};

const fitlerTasksByCategory = (
  tasks: Task[],
  category: Category | undefined
) => {
  if (!category) return tasks;
  const filtered = [];

  for (let index = 0; index < tasks.length; index++) {
    const element = tasks[index];
    if (element.categories.find((cat) => cat.category.id === category.id)) {
      filtered.push(element);
    }
  }

  return filtered;
};

const filterTasksByStatus = (tasks: Task[], status: TaskStatuses) => {
  if (!status) return tasks;

  const filtered = [];

  for (let index = 0; index < tasks.length; index++) {
    const element = tasks[index];
    if (taskStatus(element) === TaskStatuses[status]) {
      filtered.push(element);
    }
  }

  return filtered;
};

export const filterTasks = (tasks: Task[], filters: TaskFilters) => {
  let _tasks = fitlerTasksByCategory(tasks, filters?.category);

  _tasks = filterTasksByStatus(_tasks, filters?.status);

  return _tasks;
};
