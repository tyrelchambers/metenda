import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { addWeeks, endOfWeek, startOfWeek } from "date-fns";
import { getCommonFormData, useUser } from "~/utils";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";

import { Button } from "~/components/Button";
import { Category } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Heading } from "~/components/Heading";
import Input from "~/components/Input";
import Label from "~/components/Label";
import LabelSubtitle from "~/components/LabelSubtitle";
import Main from "~/layout/Main";
import Modal from "~/components/Modal";
import { MultiSelect } from "@mantine/core";
import NewCategoryForm from "~/forms/NewCategoryForm";
import TaskDatePicker from "~/components/TaskDatePicker";
import Textarea from "~/components/Textarea";
import Wrapper from "~/layout/Wrapper";
import { createTask } from "~/models/task.server";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
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
    toDate: toDate && endOfWeek(new Date(toDate)).toISOString(),
    categories,
  });

  return redirect("/task/");
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
        <Heading type="h1">Create a new task</Heading>

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

          <TaskDatePicker task={newTask} taskHandler={setNewTask} />

          <div className="flex flex-col">
            <div className="flex-center flex justify-between">
              <Label
                htmlFor="categoryies"
                className="flex items-center justify-between"
              >
                Categories
              </Label>
              <div className="w-fit">
                <button
                  type="button"
                  onClick={() => modalState.open()}
                  className="text-indigo-500"
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="mr-4"
                    style={{ width: "14px" }}
                  />
                  Create category
                </button>
              </div>
            </div>
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
