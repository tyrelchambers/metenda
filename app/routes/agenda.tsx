import { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { Link, useLoaderData } from "@remix-run/react";
import { currentDay, getCommonFormData } from "~/utils";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { format, isAfter, isBefore, isEqual, startOfDay } from "date-fns";
import {
  getAllTasks,
  totalCompletedTasksCount,
  totalTasksCount,
  updateTask,
} from "~/models/task.server";

import { Button } from "~/components/Button";
import Calendar from "react-calendar";
import { Category } from "@prisma/client";
import CategoryPill from "~/components/CategoryPill";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TaskList from "~/components/TaskList";
import Wrapper from "~/layout/Wrapper";
import { getAllCategories } from "~/models/category.server";
import { requireUserId } from "~/session.server";
import { useCurrentWeek } from "~/hooks/useCurrentWeek";

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

  const nextWeekHandler = () => {
    nextWeek();
  };

  const previousWeekHandler = () => {
    previousWeek();
  };

  return (
    <Wrapper>
      <main className=" w-full">
        <section className="mt-6 grid grid-cols-12 gap-10">
          <div className="col-span-8 flex flex-col ">
            <div className="mt-4 mb-8 flex justify-between">
              <div className="flex flex-col">
                <p className="text-indigo-600">Viewing the week of:</p>
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
              <div className="mt-4 flex items-center gap-4">
                <Button onClick={previousWeekHandler} className="w-24">
                  Previous
                </Button>
                <Button onClick={nextWeekHandler} className="w-24">
                  Next
                </Button>
              </div>
            </div>

            <div className="flex flex-col">
              <ul className=" w-full overflow-auto rounded-3xl bg-white p-6 shadow-lg">
                {tasks.length === 0 && (
                  <li className="italic text-gray-500">
                    No tasks to show for this week
                    <Link
                      to="/task/new"
                      className="ml-8 rounded-lg bg-indigo-500 px-3 py-1 text-white"
                    >
                      Create task
                    </Link>
                  </li>
                )}
                {tasks.map((task) => (
                  <TaskList task={task} key={task.id} redirectTo="/agenda" />
                ))}
              </ul>
            </div>
          </div>
          <div className="sticky top-0 col-span-4 flex flex-col gap-6">
            <section className="rounded-3xl bg-gray-800 p-4 shadow-lg">
              <Calendar
                formatShortWeekday={(locale, date) => format(date, "eeeee")}
                prev2Label={null}
                next2Label={null}
                prevLabel={
                  <FontAwesomeIcon
                    icon={faCaretLeft}
                    style={{ width: "8px" }}
                  />
                }
                nextLabel={
                  <FontAwesomeIcon
                    icon={faCaretRight}
                    style={{ width: "8px" }}
                  />
                }
                calendarType="US"
                tileClassName={({ date }) => {
                  let className = "p-2 text-white";

                  if (isEqual(date, startOfWeek)) {
                    className += " bg-yellow-300 rounded-l-lg !text-gray-800";
                  }
                  if (isEqual(date, startOfDay(endOfWeek))) {
                    className += " bg-yellow-300  rounded-r-lg !text-gray-800";
                  }

                  if (
                    isAfter(date, startOfWeek) &&
                    isBefore(date, startOfDay(endOfWeek))
                  ) {
                    className += " bg-yellow-300 !text-gray-800";
                  }

                  return className;
                }}
                selectRange={true}
              />
            </section>
            <section className="rounded-3xl bg-white p-4 shadow-lg">
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
