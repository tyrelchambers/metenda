import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { Category, Task } from "@prisma/client";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import {
  deleteCategoryOnTask,
  getTaskById,
  updateTask,
} from "~/models/task.server";

import { Button } from "~/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "~/components/Input";
import Label from "~/components/Label";
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
  const categories = formData.get("categories");

  const { title, notes, taskId } = await getCommonFormData(formData, [
    "title",
    "notes",
    "taskId",
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
      await updateTask({ id: params.id, userId, title, notes, categories });
      return redirect("/agenda");
    }
  }
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

  return (
    <Wrapper>
      <main className="mt-8 flex h-fit w-full max-w-xl flex-col gap-4 rounded-3xl bg-white p-4 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">{task.title}</h1>
        <fetcher.Form method="patch" className="flex flex-col gap-4">
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
        </fetcher.Form>

        <div className="flex flex-col">
          <Label>Task categories</Label>
          <ul className="flex flex-col">
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
        <hr className="mt-4 mb-4" />
        <div className="flex flex-col">
          <Label htmlFor="categoryies">Add categories</Label>
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
        <div className="flex items-center gap-4">
          <Button variant="secondary">Discard</Button>
          <Button onClick={submitHandler}>Update task</Button>
        </div>
      </main>
    </Wrapper>
  );
};

export default TaskEdit;
