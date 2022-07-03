import { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { deleteTask, getAllTasks, updateTask } from "~/models/task.server";

import { Heading } from "~/components/Heading";
import Main from "~/layout/Main";
import React from "react";
import { Task } from "@prisma/client";
import TaskList from "~/components/TaskList";
import Wrapper from "~/layout/Wrapper";
import { requireUserId } from "~/session.server";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const tasks = await getAllTasks({ userId });
  return tasks;
};

const Tasks = () => {
  const tasks = useLoaderData();

  return (
    <Wrapper>
      <Main>
        <Heading type="h1">All of your weekly tasks</Heading>
        <ul>
          {tasks.map((task: Task) => (
            <TaskList task={task} key={task.id} redirectTo="/tasks" />
          ))}
        </ul>
      </Main>
    </Wrapper>
  );
};

export default Tasks;
