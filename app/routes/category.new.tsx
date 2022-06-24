import { ActionFunction, redirect } from "@remix-run/server-runtime";
import React, { useState } from "react";
import { getCommonFormData, getRandomColor } from "~/utils";

import { Button } from "~/components/Button";
import CategoryPill from "~/components/CategoryPill";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form } from "@remix-run/react";
import Input from "~/components/Input";
import Label from "~/components/Label";
import Wrapper from "~/layout/Wrapper";
import { createCategory } from "~/models/category.server";
import { faDice } from "@fortawesome/free-solid-svg-icons";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const { title, color } = getCommonFormData(formData, ["title", "color"]);

  await createCategory({ userId, title, color });

  return redirect("/agenda");
};

const Category = () => {
  const [color, setColor] = useState("#8E4AD0");

  const handleColorChange = () => {
    const color = getRandomColor();

    setColor(color);
  };

  return (
    <Wrapper>
      <main className="w-full">
        <h1 className="text-3xl font-bold text-gray-800">
          Create a new category
        </h1>

        <Form
          method="post"
          className="shadow-lgl mt-8 flex w-full max-w-xl flex-col gap-4 rounded-3xl bg-white p-6"
        >
          <div className="flex flex-col">
            <Label htmlFor="title">Name</Label>
            <Input type="text" placeholder="Name of category" name="title" />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="color">Color</Label>
            <button
              type="buttonx"
              className="flex items-center gap-2"
              onClick={handleColorChange}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500">
                <FontAwesomeIcon
                  icon={faDice}
                  name="color"
                  className="w-6 text-white"
                />
              </span>
              <Input value={color} />
            </button>
          </div>

          <input type="text" hidden value={color} name="color" />

          <div className="flex flex-col">
            <Label>Preview</Label>
            <CategoryPill
              data={{
                title: "category preview",
                color,
              }}
            />
          </div>
          <hr className="mt-4 mb-4" />
          <Button>Save category</Button>
        </Form>
      </main>
    </Wrapper>
  );
};

export default Category;
