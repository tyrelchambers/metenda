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

export type TaskStatusProps = TaskStatuses;

export enum TaskStatuses {
  DONE = "done",
  IN_PROGRESS = "inProgress",
  INCOMPLETE = "incomplete",
}
