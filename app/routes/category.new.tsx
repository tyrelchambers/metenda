import { ActionFunction, redirect } from "@remix-run/server-runtime";

import { Form } from "@remix-run/react";
import React from "react";
import { createCategory } from "~/models/category.server";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");

  await createCategory({ userId, title });

  return redirect("/agenda");
};

const Category = () => {
  return (
    <div>
      <Form method="post">
        <div className="flex flex-col">
          <label htmlFor="title">Title</label>
          <input type="text" placeholder="Name of task" name="title" />
        </div>

        <button className="rounded-md bg-indigo-500 p-1 px-3 text-white">
          Save category
        </button>
      </Form>
    </div>
  );
};

export default Category;
