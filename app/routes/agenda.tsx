import { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import {
  buildFilterString,
  currentDay,
  filterTasks,
  getCommonFormData,
} from "~/utils";
import {
  faCaretCircleLeft,
  faCaretCircleRight,
  faSlidersUp,
} from "@fortawesome/pro-light-svg-icons";
import {
  getAllTasks,
  totalCompletedTasksCount,
  totalTasksCount,
  updateTask,
} from "~/models/task.server";

import { Category } from "@prisma/client";
import CategoryPill from "~/components/CategoryPill";
import FilterString from "~/components/FilterString";
import FilterTasks from "~/components/FilterTasks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Month } from "@mantine/dates";
import TaskList from "~/components/TaskList";
import Wrapper from "~/layout/Wrapper";
import { format } from "date-fns";
import { getAllCategories } from "~/models/category.server";
import { requireUserId } from "~/session.server";
import { useCurrentWeek } from "~/hooks/useCurrentWeek";
import { useEffect } from "react";
import { useTaskFilter } from "~/hooks/useTaskFilter";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const startOfWeek = url.searchParams.get("startOfWeek");
  const endOfWeek = url.searchParams.get("endOfWeek");
  const totalTasks = await totalTasksCount({ userId });
  const completedTasks = await totalCompletedTasksCount({
    userId,
    completed: true,
  });

  const tasks = await getAllTasks({
    userId,
    after: startOfWeek,
    before: endOfWeek,
  });

  const categories = await getAllCategories({ userId });
  return { tasks, categories, totalTasks, completedTasks };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const type = formData.get("type");
  const { id, done, incomplete } = await getCommonFormData(formData, [
    "id",
    "done",
    "incomplete",
  ]);

  switch (type) {
    case "toggleDone": {
      return await updateTask({ userId, id, done: done === "true" });
    }

    case "markAsIncomplete": {
      return await updateTask({
        userId,
        id,
        incomplete: incomplete === "true",
      });
    }
  }

  return null;
};

const Agenda = () => {
  const { tasks, categories } = useLoaderData();
  const { startOfWeek, endOfWeek, nextWeek, previousWeek } =
    useCurrentWeek(currentDay);
  const navigate = useNavigate();
  const { filters, setFilter, resetFilters, removeFilter } = useTaskFilter();

  const filteredTasks = filterTasks(tasks, filters);

  useEffect(() => {
    navigate(
      `?startOfWeek=${startOfWeek.toISOString()}&endOfWeek=${endOfWeek.toISOString()}`
    );
  }, [startOfWeek, endOfWeek]);

  const nextWeekHandler = () => {
    nextWeek();
  };

  const previousWeekHandler = () => {
    previousWeek();
  };

  return (
    <Wrapper>
      <main className=" w-full">
        <section className="grid grid-cols-12 gap-10">
          <div className="col-span-8 flex flex-col ">
            <div className=" mb-6 flex flex-col">
              <div className="flex flex-col">
                <p className="mt-2 text-3xl">
                  <span className=" font-bold text-gray-800">
                    {format(startOfWeek, "MMMM do")}
                  </span>{" "}
                  <span className="font-thin text-gray-500">to</span>{" "}
                  <span className=" font-bold text-gray-800">
                    {format(endOfWeek, "MMMM do")}
                  </span>
                </p>
              </div>
              <div className="mt-4 flex items-center gap-6">
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm text-indigo-500"
                  onClick={previousWeekHandler}
                >
                  <FontAwesomeIcon
                    icon={faCaretCircleLeft}
                    className="text-indigo-500 transition-all"
                    style={{ width: "22px" }}
                  />
                  Prev
                </button>

                <button
                  type="button"
                  onClick={nextWeekHandler}
                  className="flex items-center gap-1 text-sm text-indigo-500"
                >
                  <FontAwesomeIcon
                    icon={faCaretCircleRight}
                    className=" transition-all"
                    style={{ width: "22px" }}
                  />
                  Next
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <div className=" flex w-full flex-col gap-4 overflow-auto rounded-3xl bg-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <p className="flex items-center text-gray-600">
                      Filter tasks
                    </p>
                    <FilterString
                      filters={filters}
                      removeFilter={removeFilter}
                    />
                  </div>
                  <FilterTasks
                    categories={categories}
                    setFilter={setFilter}
                    resetFilters={resetFilters}
                  />
                </div>
                <hr />
                {tasks.length === 0 && (
                  <p className="italic text-gray-500">
                    No tasks to show for this week
                    <Link
                      to="/task/new"
                      className="ml-8 rounded-lg bg-indigo-500 px-3 py-1 text-white"
                    >
                      Create task
                    </Link>
                  </p>
                )}
                <TaskList tasks={filteredTasks} redirectTo="/agenda" />
              </div>
            </div>
          </div>
          <div className="sticky top-0 col-span-4 flex flex-col gap-6">
            <section className="rounded-3xl bg-gray-800 p-4 ">
              <p className="mb-2 py-2 text-center font-medium text-white">
                {format(startOfWeek, "MMMM") !== format(endOfWeek, "MMMM")
                  ? `${format(startOfWeek, "MMMM")} - ${format(
                      endOfWeek,
                      "MMMM"
                    )}`
                  : format(startOfWeek, "MMMM")}
              </p>
              <Month
                month={startOfWeek}
                range={[startOfWeek, endOfWeek]}
                firstDayOfWeek="sunday"
                className="w-full"
                dayStyle={(day, { inRange, weekend, outside }) => {
                  const styles = {};
                  if (inRange) {
                    styles.backgroundColor = "rgb(253 224 71)";
                    styles.color = "rgb(51 65 85)";
                  } else {
                    styles.color = "rgb(226 232 240)";
                  }

                  if (weekend && !inRange && !outside) {
                    styles.color = "rgb(226 232 240)";
                  }

                  return {
                    ...styles,
                    width: "100%",
                  };
                }}
              />
            </section>
            <section className="rounded-3xl bg-white p-4 ">
              <h2 className=" font-bold text-gray-800">Categories</h2>

              <ul className="mt-4 flex flex-wrap gap-2">
                {categories.length === 0 && (
                  <p className="text-sm italic text-gray-500">
                    No categories have been created
                  </p>
                )}
                {categories.map((cat: Category) => (
                  <li key={cat.id}>
                    <CategoryPill data={cat} />
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </section>
      </main>
    </Wrapper>
  );
};

export default Agenda;
