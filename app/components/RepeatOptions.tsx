import React, { useState } from "react";
import { faCalendarAlt, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { faCircle2, faClock } from "@fortawesome/pro-light-svg-icons";
import { format, parseISO } from "date-fns";

import { DatePicker } from "@mantine/dates";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popover from "./PopOver";
import { currentDay } from "~/utils";
import { useCurrentWeek } from "../hooks/useCurrentWeek";

const RepeatOptions = ({
  toDate,
  setToDate,
}: {
  toDate: string;
  setToDate: (val: Date) => void;
}) => {
  const { startOfWeek } = useCurrentWeek(currentDay);

  return (
    <Popover
      triggerLabel={
        <div className="rounded-lg border-[1px] border-gray-200 bg-gray-100 py-1 px-3">
          <FontAwesomeIcon
            icon={faClock}
            className="mr-2"
            style={{ width: "18px" }}
          />
          Schedule
        </div>
      }
    >
      <div className=" flex flex-col gap-4">
        <p className="text-lg font-medium text-gray-900">
          <FontAwesomeIcon
            icon={faClock}
            className="mr-2"
            style={{ width: "14px" }}
          />
          Schedule
        </p>

        <hr />
        <div className="flex items-center justify-between rounded-lg bg-gray-100 p-3">
          <p className="text-sm text-gray-700">Current week</p>
          <p className="ml-4 text-sm text-gray-500">
            {format(startOfWeek, "MMM do")}
          </p>
        </div>
        <DatePicker
          placeholder="Pick date"
          label="To week of"
          withinPortal={false}
          value={toDate ? new Date(toDate) : undefined}
          onChange={setToDate}
          minDate={startOfWeek}
        />
        <hr />
        <p className="t-sm text-gray-700">Repeat</p>
        <button
          type="button"
          className="text-left text-sm text-gray-600 transition-all hover:text-indigo-400"
        >
          <FontAwesomeIcon
            icon={faRepeat}
            className="mr-4 text-indigo-400"
            style={{ width: "14px" }}
          />
          Every week
        </button>

        <button
          type="button"
          className="text-left text-sm text-gray-600 transition-all hover:text-indigo-400"
        >
          <FontAwesomeIcon
            icon={faCircle2}
            className="mr-4 text-orange-400"
            style={{ width: "14px" }}
          />
          Every other week
        </button>

        <button
          type="button"
          className="text-left text-sm text-gray-600 transition-all hover:text-indigo-400"
        >
          <FontAwesomeIcon
            icon={faCalendarAlt}
            className="mr-4 text-pink-400"
            style={{ width: "14px" }}
          />
          Once a month
        </button>
      </div>
    </Popover>
  );
};

export default RepeatOptions;
