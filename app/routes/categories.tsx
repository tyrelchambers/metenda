import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { deleteCategory, getAllCategories } from "~/models/category.server";

import type { Category } from "@prisma/client";
import CategoryList from "~/components/CategoryList";
import { Heading } from "~/components/Heading";
import Main from "~/layout/Main";
import React from "react";
import Wrapper from "~/layout/Wrapper";
import { getCommonFormData } from "~/utils";
import { requireUserId } from "~/session.server";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const categories = await getAllCategories({ userId });
  return { categories };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const { id } = await getCommonFormData(formData, ["id"]);

  if (id && userId) {
    await deleteCategory({ userId, id });
  }

  return redirect("/categories");
};

const Categories = () => {
  const { categories } = useLoaderData();

  return (
    <Wrapper>
      <Main>
        <Heading type="h1">All your categories</Heading>
        {categories.length === 0 && (
          <p className="text-sm italic text-gray-500">You have no categories</p>
        )}
        <ul>
          {categories.map((category: Category) => (
            <CategoryList key={category.id} category={category} />
          ))}
        </ul>
      </Main>
    </Wrapper>
  );
};

export default Categories;
