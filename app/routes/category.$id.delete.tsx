import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";

import { deleteCategory } from "~/models/category.server";
import { requireUserId } from "~/session.server";

export const loader: LoaderFunction = ({ request }) => {
  return redirect("/categories");
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const id = formData.get("id");

  return await deleteCategory({ userId, id });
};
