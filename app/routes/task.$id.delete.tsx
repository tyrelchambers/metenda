import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";

import { deleteTask } from "~/models/task.server";
import { requireUserId } from "~/session.server";

export const loader: LoaderFunction = ({ request }) => {
  return redirect("/agenda");
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();

  const taskId = formData.get("id");

  return await deleteTask({ userId, id: taskId });
};
