import { Category, Task } from "@prisma/client";

export interface TaskRepeatDetails {
  fromDate: Date;
  toDate: Date;
  repeatWeeks: number;
  willRepeatEveryWeek: boolean;
}

export interface CommonFormData extends Partial<Task & Category> {
  willRepeatEveryWeek: boolean;
}

export enum TaskStatuses {
  DONE = "done",
  IN_PROGRESS = "in progress",
  INCOMPLETE = "incomplete",
}

export interface TaskFilters {
  category: Category | undefined;
  status: TaskStatuses | undefined;
}
