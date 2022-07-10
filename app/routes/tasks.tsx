import { LoaderFunction } from "@remix-run/server-runtime";
import { getAllTasks } from "~/models/task.server";

import { Heading } from "~/components/Heading";
import Main from "~/layout/Main";
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
        <TaskList tasks={tasks} redirectTo="/tasks" />
      </Main>
    </Wrapper>
  );
};

export default Tasks;
