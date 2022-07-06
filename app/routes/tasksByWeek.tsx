import { LoaderFunction } from "@remix-run/server-runtime";
import { getAllTasks } from "~/models/task.server";
import { requireUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  const url = new URL(request.url);
  const startOfWeek = url.searchParams.get("startOfWeek");
  const endOfWeek = url.searchParams.get("endOfWeek");
  const tasks = await getAllTasks({
    userId,
    after: startOfWeek,
    before: endOfWeek,
  });
  return tasks;
};
