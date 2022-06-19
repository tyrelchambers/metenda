import { faMinusCircle, faPencil } from "@fortawesome/free-solid-svg-icons";

import type { Category } from "@prisma/client";
import CategoryList from "~/components/CategoryList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import type { LoaderFunction } from "@remix-run/server-runtime";
import React from "react";
import Wrapper from "~/layout/Wrapper";
import { getAllCategories } from "~/models/category.server";
import { requireUserId } from "~/session.server";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const categories = await getAllCategories({ userId });
  return { categories };
};

const Categories = () => {
  const { categories } = useLoaderData();

  return (
    <Wrapper>
      <main className="w-full">
        <h1 className="text-3xl font-bold text-gray-800">
          All your categories
        </h1>
        <ul className="mt-6 w-full max-w-3xl rounded-3xl bg-white p-4 shadow-lg">
          {categories.map((category: Category) => (
            <CategoryList key={category.id} category={category} />
          ))}
        </ul>
      </main>
    </Wrapper>
  );
};

export default Categories;
