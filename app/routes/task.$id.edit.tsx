import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { Category, Task } from "@prisma/client";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import {
  createCategoryOnTask,
  deleteCategoryOnTask,
  getTaskById,
  updateTask,
} from "~/models/task.server";
import { endOfWeek, startOfWeek } from "date-fns";
import { faMinusCircle, faTimes } from "@fortawesome/free-solid-svg-icons";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Button } from "~/components/Button";
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
  const redirectTo = (await formData.get("redirectTo")) as string;

  const categories = formData.getAll("newCategory");

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

  if (categories.length) {
    for (let index = 0; index < categories.length; index++) {
      const element = categories[index];
      await createCategoryOnTask({
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
    incomplete,
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
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col">
            <Label>Repeat</Label>
            <LabelSubtitle text="When would you like this task to run until?" />

            <label className="mb-4 mt-4 text-sm text-gray-800">
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
                    setNewTask({
                      ...newTask,
                      fromDate: newValue?.toISOString(),
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>

              {!newTask.willRepeatEveryWeek ||
                (!newTask.toDate && (
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
                ))}
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
            {console.log(selectedCategories)}
            {selectedCategories.length &&
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

          <label
            htmlFor="incomplete"
            className="flex gap-2 text-sm text-gray-600"
          >
            <CheckBox
              name="incomplete"
              checked={newTask.incomplete || false}
              changeHandler={checkIncomplete}
            />
            Mark as incomplete
          </label>

          <div className="flex items-center gap-4">
            <Button variant="secondary">Discard</Button>
            <Button>Update task</Button>
          </div>
        </Form>
      </Main>
    </Wrapper>
  );
};

export default TaskEdit;
