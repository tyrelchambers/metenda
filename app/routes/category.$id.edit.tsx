import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import React, { useState } from "react";
import { getCategoryById, updateCategory } from "~/models/category.server";
import { getCommonFormData, getRandomColor } from "~/utils";

import { Button } from "~/components/Button";
import { Category } from "@prisma/client";
import CategoryPill from "~/components/CategoryPill";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Heading } from "~/components/Heading";
import Input from "~/components/Input";
import Label from "~/components/Label";
import Main from "~/layout/Main";
import Wrapper from "~/layout/Wrapper";
import { faDice } from "@fortawesome/free-solid-svg-icons";
import { requireUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = requireUserId(request);
  const category = await getCategoryById({ userId, id: params.id });
  return category;
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = requireUserId(request);
  const formData = await request.formData();
  const { title, color } = await getCommonFormData(formData, [
    "title",
    "color",
  ]);

  await updateCategory({
    userId,
    id: params.id,
    title,
    color,
  });

  return redirect(`/categories`);
};

const CategoryEdit = () => {
  const data = useLoaderData();
  const [category, setCategory] = useState<Category>(data);
  const navigate = useNavigate();

  const handleColorChange = () => {
    const color = getRandomColor();

    setCategory({ ...category, color });
  };

  return (
    <Wrapper>
      <Main>
        <Heading type="h1">Edit your category</Heading>
        <Form className="flex flex-col gap-4" method="patch">
          <div className="flex flex-col">
            <Label htmlFor="title">Title</Label>
            <Input
              placeholder="Your category title"
              name="title"
              value={category.title}
              onChange={(e) =>
                setCategory({ ...category, title: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500">
                <FontAwesomeIcon
                  icon={faDice}
                  name="color"
                  className="w-6 text-white"
                  onClick={handleColorChange}
                />
              </span>
              <Input
                value={category.color}
                onChange={(e) =>
                  setCategory({ ...category, color: e.targrt.value })
                }
              />
            </div>

            <input
              type="text"
              hidden
              value={category.color}
              name="color"
              readOnly
            />
          </div>

          <div className="flex flex-col">
            <Label>Preview</Label>
            <CategoryPill
              data={{
                title: category.title || "category preview",
                color: category.color,
              }}
            />
          </div>

          <hr className="mt-4 mb-4" />
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={() => navigate("/agenda")}>
              Discard
            </Button>
            <Button>Save task</Button>
          </div>
        </Form>
      </Main>
    </Wrapper>
  );
};

export default CategoryEdit;
