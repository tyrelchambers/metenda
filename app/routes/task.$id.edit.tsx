import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { Button, SecondaryButtonStyles } from "~/components/Button";
import { Category, Task } from "@prisma/client";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Form, Link, useLoaderData } from "@remix-run/react";
import {
  createCategoryOnTask,
  deleteCategoryOnTask,
  getTaskById,
  updateTask,
} from "~/models/task.server";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CheckBox from "~/components/CheckBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "~/components/Input";
import Label from "~/components/Label";
import LabelSubtitle from "~/components/LabelSubtitle";
import Main from "~/layout/Main";
import { MultiSelect } from "@mantine/core";
import { TextField } from "@mui/material";
import Textarea from "~/components/Textarea";
import Wrapper from "~/layout/Wrapper";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { getAllCategories } from "~/models/category.server";
import { getCommonFormData } from "~/utils";
import { requireUserId } from "~/session.server";
import { startOfWeek } from "date-fns";
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
  const redirectTo = (await formData.get("redirectTo")) as string;

  const newCategories = await formData.getAll("newCategory");
  const taskCategories = await formData.getAll("taskCategories");
  const taskCategoriesOriginal = await formData.getAll("taskCategoriesCopy");

  const { title, notes, fromDate, toDate, done, incomplete } =
    await getCommonFormData(formData, [
      "title",
      "notes",
      "taskId",
      "fromDate",
      "toDate",
      "done",
      "incomplete",
    ]);

  if (newCategories.length) {
    for (let index = 0; index < newCategories.length; index++) {
      const element = newCategories[index];
      await createCategoryOnTask({
        taskId: params.id,
        categoryId: element,
      });
    }
  }

  const categoriesToDelete = taskCategoriesOriginal.filter(
    (category) => !taskCategories.includes(category)
  );

  if (categoriesToDelete.length) {
    for (let index = 0; index < categoriesToDelete.length; index++) {
      const element = categoriesToDelete[index];

      await deleteCategoryOnTask({
        taskId: params.id,
        categoryId: element,
      });
    }
  }

  const payload: Partial<Task> = {
    id: params.id,
    userId,
    title,
    notes,
    incomplete: incomplete === "on" ? true : false,
    done,
    fromDate: fromDate && startOfWeek(new Date(fromDate)).toISOString(),
  };

  // if (toDate !== "null" || !toDate) {
  //   console.log(toDate);

  //   payload.toDate = endOfWeek(new Date(toDate)).toISOString();
  // }

  await updateTask({ ...payload });

  return redirect(redirectTo || `/task/${params.id}`);
};

const TaskEdit = () => {
  const { task, categories } = useLoaderData();
  const { newTask, setNewTask, categoriesHandler, selectedCategories } =
    useTask(task);
  const taskCategoriesCopy = [...task.categories];

  const deleteHandler = (categoryId: string) => {
    setNewTask({
      ...newTask,
      categories: newTask.categories.filter(
        (category) => category.category.id !== categoryId
      ),
    });
  };

  const filterExistingCategories = () => {
    const filteredCategories = categories.filter(
      (c) => !task.categories.some((tc) => tc.category.id === c.id)
    );

    return filteredCategories;
  };

  const checkIncomplete = () => {
    setNewTask({ ...newTask, incomplete: !newTask.incomplete });
  };

  return (
    <Wrapper>
      <Main>
        <h1 className="text-3xl font-bold text-gray-800">
          Editing: {task.title}
        </h1>
        <Form className="flex flex-col gap-8" method="patch">
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
            <LabelSubtitle text="Use notes to add any additional information" />

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

          <div className="flex flex-col">
            <Label>Task categories</Label>
            <LabelSubtitle text="These categories are already associated with this task" />

            <ul className="flex flex-col">
              {!newTask.categories.length && (
                <p className="rounded-lg bg-gray-50 p-4 text-sm font-thin italic text-gray-500">
                  No categories on this task
                </p>
              )}
              {newTask.categories.map((c) => (
                <li
                  key={c.category.id}
                  className="flex items-center justify-between border-b-[1px] border-gray-300 py-4"
                >
                  <p className="text-sm text-gray-600">{c.category.title}</p>
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
                  <input
                    key={c.category.id}
                    type="text"
                    value={c.category.id}
                    hidden
                    readOnly
                    name="taskCategories"
                  />
                </li>
              ))}
            </ul>
            {!!taskCategoriesCopy.length &&
              taskCategoriesCopy.map((c) => (
                <input
                  key={c.category.id}
                  type="text"
                  value={c.category.id}
                  hidden
                  readOnly
                  name="taskCategoriesCopy"
                />
              ))}
          </div>
          <div className="flex flex-col">
            <Label>Repeat</Label>
            <LabelSubtitle text="When would you like this task to run until? Leave the second date empty to repeat every week." />

            <div className="mt-2 grid grid-cols-2 gap-6">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="From"
                  value={newTask.fromDate}
                  onChange={(newValue) => {
                    setNewTask({
                      ...newTask,
                      fromDate: newValue?.toISOString(),
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="To"
                  value={newTask.toDate}
                  onChange={(newValue) => {
                    setNewTask({
                      ...newTask,
                      toDate: newValue?.toISOString(),
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="categoryies">Add categories</Label>
            {filterExistingCategories().length === 0 && (
              <p className="text-sm font-thin italic text-gray-500">
                There aren't any categories available to add to this task
              </p>
            )}
            {filterExistingCategories().length > 0 && (
              <MultiSelect
                data={filterExistingCategories().map((c: Category) => ({
                  value: c.id,
                  label: c.title,
                }))}
                placeholder="Pick your categories"
                onChange={(e) => categoriesHandler(e)}
              />
            )}

            {!!selectedCategories.length &&
              selectedCategories.map((c) => (
                <input
                  key={c}
                  type="text"
                  hidden
                  readOnly
                  value={c}
                  name="newCategory"
                />
              ))}
          </div>
          <hr className="mt-4" />

          <CheckBox
            name="incomplete"
            checked={newTask.incomplete || false}
            changeHandler={checkIncomplete}
            label="Mark as incomplete"
          />

          <div className="flex items-center gap-4">
            <Link className={SecondaryButtonStyles} to={`/agenda`}>
              Discard
            </Link>
            <Button>Update task</Button>
          </div>
        </Form>
      </Main>
    </Wrapper>
  );
};

export default TaskEdit;
