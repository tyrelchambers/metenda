import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { addWeeks, endOfWeek, startOfWeek } from "date-fns";
import { getCommonFormData, useUser } from "~/utils";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Button } from "~/components/Button";
import { Category } from "@prisma/client";
import Input from "~/components/Input";
import Label from "~/components/Label";
import LabelSubtitle from "~/components/LabelSubtitle";
import Main from "~/layout/Main";
import Modal from "~/components/Modal";
import { MultiSelect } from "@mantine/core";
import NewCategoryForm from "~/forms/NewCategoryForm";
import { TextField } from "@mui/material";
import Textarea from "~/components/Textarea";
import Wrapper from "~/layout/Wrapper";
import { createTask } from "~/models/task.server";
import { getAllCategories } from "~/models/category.server";
import { requireUserId } from "~/session.server";
import { useModal } from "~/stores/useModal";
import { useTask } from "~/hooks/useTask";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = requireUserId(request);
  const categories = await getAllCategories({ userId });

  return { categories };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const { title, notes, fromDate, toDate } = await getCommonFormData(formData, [
    "title",
    "notes",
    "fromDate",
    "toDate",
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
    categories,
  });

  return redirect("/task/new");
};

const NewItem = () => {
  const modalState = useModal((state) => state);
  const user = useUser();

  const fetcher = useFetcher();
  const { newTask, setNewTask, categoriesHandler, selectedCategories } =
    useTask();

  const navigate = useNavigate();

  const { categories } = useLoaderData();

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    fetcher.submit(
      {
        ...newTask,
        categories:
          selectedCategories.length > 0
            ? selectedCategories.map((c) => c)
            : null,
      },
      { method: "post" }
    );
  };

  const createCategoryHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const { title, color } = await getCommonFormData(formData, [
      "title",
      "color",
    ]);

    fetcher.submit(
      {
        userId: user.id,
        title,
        color,
      },
      { method: "post", action: "/category/new" }
    );

    modalState.close();
  };

  return (
    <Wrapper>
      <Main>
        <h1 className="text-3xl font-bold text-gray-800">Create a new task</h1>
        <fetcher.Form className="flex flex-col gap-8">
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
              id="title"
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="notes">Notes</Label>
            <LabelSubtitle text="Use notes to add any additional information" />
            <Textarea
              placeholder="Task notes"
              name="notes"
              value={newTask.notes}
              onChange={(e) =>
                setNewTask({ ...newTask, notes: e.target.value })
              }
              id="notes"
            />
          </div>
          <div className="flex flex-col">
            <Label>Repeat</Label>
            <LabelSubtitle text="When would you like this task to run until?" />
            <label className="mb-6 mt-2  text-sm text-gray-600">
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
                  label="From week of"
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

              {!newTask.willRepeatEveryWeek && (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="To week of"
                    value={newTask.toDate}
                    onChange={(newValue) => {
                      setNewTask({
                        ...newTask,
                        toDate: newValue?.toISOString(),
                      });
                    }}
                    minDate={newTask.fromDate}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <Label
              htmlFor="categoryies"
              className="flex items-center justify-between"
            >
              Categories
              <div className="w-fit">
                <Button variant="secondary" onClick={() => modalState.open()}>
                  Create category
                </Button>
              </div>
            </Label>
            {categories.length === 0 && (
              <p className="text-sm italic text-gray-400">
                There aren't any categories. You can create one.
              </p>
            )}
            {categories.length > 0 && (
              <MultiSelect
                data={categories.map((c: Category) => ({
                  value: c.id,
                  label: c.title,
                }))}
                placeholder="Pick your categories"
                onChange={(e) => categoriesHandler(e)}
                className="mt-2"
              />
            )}
          </div>

          <hr className="mt-4 mb-4" />

          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={() => navigate("/agenda")}>
              Discard
            </Button>
            <Button onClick={submitHandler}>Create task</Button>
          </div>
        </fetcher.Form>
      </Main>
      <Modal
        title="Create a category"
        description="This will quickly create a new category to associate with your task"
        content={
          <NewCategoryForm
            redirectTo="/task/new"
            handleSubmit={createCategoryHandler}
          />
        }
        footerActions={() => null}
      />
    </Wrapper>
  );
};

export default NewItem;
