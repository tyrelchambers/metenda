import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { addWeeks, endOfWeek, startOfWeek } from "date-fns";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Button } from "~/components/Button";
import { Category } from "@prisma/client";
import Input from "~/components/Input";
import Label from "~/components/Label";
import { TextField } from "@mui/material";
import Textarea from "~/components/Textarea";
import Wrapper from "~/layout/Wrapper";
import { createTask } from "~/models/task.server";
import { getAllCategories } from "~/models/category.server";
import { getCommonFormData } from "~/utils";
import { requireUserId } from "~/session.server";
import { useTask } from "~/hooks/useTask";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = requireUserId(request);
  const categories = await getAllCategories({ userId });

  return { categories };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const { title, notes, fromDate, toDate, willRepeatEveryWeek } =
    await getCommonFormData(formData, [
      "title",
      "notes",
      "fromDate",
      "toDate",
      "willRepeatEveryWeek",
    ]);

  const categories = formData.get("categories");

  await createTask({
    userId,
    title,
    notes,
    fromDate: startOfWeek(new Date(fromDate)).toISOString(),
    toDate: toDate
      ? endOfWeek(new Date(toDate)).toISOString()
      : endOfWeek(addWeeks(fromDate, 1)).toISOString(),
    willRepeatEveryWeek,
    categories,
  });

  return redirect("/agenda");
};

const NewItem = () => {
  const fetcher = useFetcher();
  const {
    newTask,
    setNewTask,
    categoriesHandler,
    isActiveCategory,
    selectedCategories,
  } = useTask();

  const navigate = useNavigate();

  const { categories } = useLoaderData();

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    fetcher.submit(
      {
        ...newTask,
        categories:
          selectedCategories.length > 0
            ? selectedCategories.map((c) => c.id)
            : null,
      },
      { method: "post" }
    );
  };

  return (
    <Wrapper>
      <main className="w-full">
        <h1 className="text-3xl font-bold text-gray-800">Create a new task</h1>
        <fetcher.Form className="mt-8 flex w-full max-w-xl flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg">
          <div className="flex flex-col">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              placeholder="Name of task"
              name="title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              placeholder="Task notes"
              name="notes"
              value={newTask.notes}
              onChange={(e) =>
                setNewTask({ ...newTask, notes: e.target.value })
              }
            />
          </div>
          <hr />
          <p className="text-indigo-500">Repeat</p>
          <label className="mb-2 text-sm text-gray-800">
            <input
              type="checkbox"
              name="willRepeat"
              checked={newTask.willRepeatEveryWeek}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  willRepeatEveryWeek: e.target.checked,
                })
              }
              className="mr-2"
            />
            Every week
          </label>
          <div className="grid grid-cols-2 gap-6">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="From"
                value={newTask.fromDate}
                onChange={(newValue) => {
                  setNewTask({ ...newTask, fromDate: newValue?.toISOString() });
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            {!newTask.willRepeatEveryWeek && (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="To"
                  value={newTask.toDate}
                  onChange={(newValue) => {
                    setNewTask({ ...newTask, toDate: newValue?.toISOString() });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            )}
          </div>

          <hr />

          <div className="flex flex-col">
            <Label htmlFor="categoryies">Categories</Label>
            <ul className="mt-2 flex flex-wrap gap-2">
              {categories.map((category: Category) => (
                <li key={category.id}>
                  <p
                    className={`cursor-pointer rounded-full bg-gray-100 px-3 py-1 ${
                      isActiveCategory(category) && "!bg-indigo-500 text-white"
                    }`}
                    onClick={() => categoriesHandler(category)}
                  >
                    {category.title}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <hr className="mt-4 mb-4" />

          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={() => navigate("/agenda")}>
              Discard
            </Button>
            <Button onClick={submitHandler}>Save task</Button>
          </div>
        </fetcher.Form>
      </main>
    </Wrapper>
  );
};

export default NewItem;
