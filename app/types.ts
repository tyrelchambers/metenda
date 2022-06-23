export interface TaskRepeatDetails {
  fromDate: Date;
  toDate: Date;
  repeatWeeks: number;
  willRepeatEveryWeek: boolean;
}

export interface CommonFormData {
  title?: string;
  notes: string;
  fromDate: Date;
  toDate: Date;
  willRepeatEveryWeek: boolean;
  taskId: string;
  name?: string;
  color?: string;
  textColor?: string;
  done?: boolean;
}
