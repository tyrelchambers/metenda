// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { DatePicker, DateRangePicker } from "@mantine/dates";

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

const TaskDatePicker = () => {
  return (
    <div className="flex flex-col gap-2">
      <DatePicker
        placeholder="Pick date"
        label="To week of"
        withinPortal={false}
      />
    </div>
  );
};

export default TaskDatePicker;
