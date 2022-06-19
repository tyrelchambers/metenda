import { deleteTask, getAllTasks, updateTask } from "~/models/task.server";

import { LoaderFunction } from "@remix-run/server-runtime";
import React from "react";
import TaskList from "~/components/TaskList";
import Wrapper from "~/layout/Wrapper";
import { requireUserId } from "~/session.server";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const tasks = await getAllTasks({ userId });
  return tasks;
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const type = formData.get("type");

  switch (type) {
    case "toggleDone": {
      const taskId = formData.get("id");
      const done = formData.get("done");

      return await updateTask({ userId, id: taskId, done: done === "true" });
    }

    case "delete": {
      const taskId = formData.get("id");

      return await deleteTask({ userId, id: taskId });
    }
  }

  return null;
};

const Tasks = () => {
  const tasks = useLoaderData();

  return (
    <Wrapper>
      <main className="w-full">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          All of your weekly tasks
        </h1>
        <ul className="w-full max-w-3xl rounded-3xl bg-white p-4 shadow-lg">
          {tasks.map((task) => (
            <TaskList task={task} key={task.id} />
          ))}
        </ul>
      </main>
    </Wrapper>
  );
};

export default Tasks;
