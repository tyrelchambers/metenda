import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { addWeeks, endOfWeek, startOfWeek } from "date-fns";
import {
  createCategoryOnTask,
  deleteCategoryOnTask,
  getTaskById,
  updateTask,
} from "~/models/task.server";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Button } from "~/components/Button";
import { Category } from "@prisma/client";
import CategoryPill from "~/components/CategoryPill";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "~/components/Input";
import Label from "~/components/Label";
import Main from "~/layout/Main";
import { TextField } from "@mui/material";
import Textarea from "~/components/Textarea";
import Wrapper from "~/layout/Wrapper";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { getAllCategories } from "~/models/category.server";
import { getCommonFormData } from "~/utils";
import { requireUserId } from "~/session.server";
import { useTask } from "~/hooks/useTask";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const task = await getTaskById({ id: params.id, userId });
  const categories = await getAllCategories({ userId });

  return { task, categories };
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const categories = formData.get("categories") as string;

  const { title, notes, taskId, fromDate, toDate, done, incomplete } =
    await getCommonFormData(formData, [
      "title",
      "notes",
      "taskId",
      "fromDate",
      "toDate",
      "done",
      "incomplete",
    ]);

  const type = formData.get("type") as string;
  const categoryId = formData.get("categoryId") as string;

  switch (type) {
    case "deleteCategoryOnTask": {
      return await deleteCategoryOnTask({
        categoryId,
        taskId,
      });
    }
    case "updateTask": {
      if (categories != "null") {
        const categoryIds = categories.split(",");

        for (let index = 0; index < categoryIds.length; index++) {
          const element = categoryIds[index];

          await createCategoryOnTask({
            taskId: params.id,
            categoryId: element,
          });
        }
      }
    }
  }

  await updateTask({
    id: params.id,
    userId,
    title,
    notes,
    incomplete,
    done,
    // fromDate: fromDate && startOfWeek(new Date(fromDate)).toISOString(),
    // toDate:
    //   toDate && fromDate
    //     ? endOfWeek(new Date(toDate)).toISOString()
    //     : undefined,
  });

  return redirect("/agenda");
};

const TaskEdit = () => {
  const { task, categories } = useLoaderData();
  const {
    newTask,
    setNewTask,
    categoriesHandler,
    isActiveCategory,
    selectedCategories,
  } = useTask(task);
  const fetcher = useFetcher();

  const deleteHandler = (categoryId: string) => {
    fetcher.submit(
      { categoryId, taskId: newTask.id, type: "deleteCategoryOnTask" },
      {
        method: "post",
      }
    );
    window.location.reload();
  };

  const submitHandler = () => {
    fetcher.submit(
      {
        ...newTask,
        categories:
          selectedCategories.length > 0
            ? selectedCategories.map((c) => c.id)
            : null,
        type: "updateTask",
      },
      { method: "post" }
    );
  };

  const filterExistingCategories = () => {
    const filteredCategories = categories.filter(
      (c) => !task.categories.some((tc) => tc.category.id === c.id)
    );

    return filteredCategories;
  };

  return (
    <Wrapper>
      <Main>
        <h1 className="text-3xl font-bold text-gray-800">{task.title}</h1>
        <Form method="patch" className="flex flex-col gap-4">
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
              rows={5}
              value={newTask.notes}
              onChange={(e) =>
                setNewTask({ ...newTask, notes: e.target.value })
              }
            />
          </div>
        </Form>

        <div className="flex flex-col">
          <Label>Task categories</Label>
          <ul className="flex flex-col">
            {newTask.categories.length === 0 && (
              <p className="text-sm font-thin italic text-gray-500">
                No categories on this task
              </p>
            )}
            {newTask.categories.map((c) => (
              <li
                key={c.category.id}
                className="flex items-center justify-between border-b-[1px] border-gray-300 py-4"
              >
                <p className="text-sm text-gray-600">{c.category.title}</p>
                <fetcher.Form>
                  <button
                    onClick={() => deleteHandler(c.category.id)}
                    type="button"
                  >
                    <FontAwesomeIcon
                      icon={faMinusCircle}
                      className="text-gray-500 transition-all hover:text-red-500"
                      style={{ width: "16px" }}
                    />
                  </button>
                </fetcher.Form>
              </li>
            ))}
          </ul>
        </div>
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

          {!newTask.toDate && (
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
        <div className="flex flex-col">
          <Label htmlFor="categoryies">Add categories</Label>
          {filterExistingCategories().length === 0 && (
            <p className="text-sm italic text-gray-500">
              There aren't any categories available to add to this task
            </p>
          )}
          <ul className="mt-2 flex flex-wrap gap-2">
            {filterExistingCategories().map((category: Category) => (
              <li key={category.id}>
                <CategoryPill
                  data={category}
                  isActiveClass="!bg-indigo-500 !text-white"
                  isActive={isActiveCategory(category)}
                  onClick={() => categoriesHandler(category)}
                />
              </li>
            ))}
          </ul>
        </div>
        <hr className="mt-4 mb-4" />

        <div className="flex items-center gap-4">
          <Button variant="secondary">Discard</Button>
          <Button onClick={submitHandler}>Update task</Button>
        </div>
      </Main>
    </Wrapper>
  );
};

export default TaskEdit;
