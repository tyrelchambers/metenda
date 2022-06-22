import { arrayFromWeeks, currentDay } from "~/utils";

import { Line } from "react-chartjs-2";
import { RChart } from "~/RChart";
import React from "react";
import { getWeeksInMonth } from "date-fns";
import { useCurrentWeek } from "~/hooks/useCurrentWeek";

RChart();

interface TasksGraphProps {
  totalTasks: number;
  completedTasks: number;
}

const TasksGraph = ({ totalTasks, completedTasks }: TasksGraphProps) => {
  const { startOfWeek } = useCurrentWeek(currentDay);
  const weeksInMonth = getWeeksInMonth(startOfWeek);

  console.log(completedTasks);

  return (
    <Line
      datasetIdKey="id"
      data={{
        labels: arrayFromWeeks(weeksInMonth),
        datasets: [
          {
            label: "Total tasks",
            data: [
              { x: 0, y: 0 },
              { x: 0, y: totalTasks },
            ],
          },
          {
            label: "Completed tasks",
            data: [
              { x: 0, y: 0 },
              { x: 0, y: completedTasks },
            ],
            borderDash: [5, 5],
            borderColor: "rgb(99 102 241)",
          },
        ],
      }}
    />
  );
};

export default TasksGraph;
