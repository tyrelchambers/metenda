import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Label from "./Label";
import LabelSubtitle from "./LabelSubtitle";
import React from "react";
import { Task } from "@prisma/client";
import { TextField } from "@mui/material";

interface Props {
  task: Partial<Task>;
  taskHandler: (task: Task) => void;
}

const TaskDatePicker = ({ task, taskHandler }: Props) => {
  return (
    <div className="flex flex-col">
      <Label>Repeat</Label>
      <LabelSubtitle text="When would you like this task to run until? Leave the second date empty to repeat every week." />

      <div className="mt-2 grid grid-cols-2 gap-6">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="From"
            value={task.fromDate}
            onChange={(newValue) => {
              taskHandler({
                ...task,
                fromDate: newValue?.toISOString(),
              });
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="To"
            value={task.toDate}
            onChange={(newValue) => {
              taskHandler({
                ...task,
                toDate: newValue?.toISOString(),
              });
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default TaskDatePicker;
