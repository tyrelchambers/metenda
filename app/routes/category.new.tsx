import { ActionFunction, redirect } from "@remix-run/server-runtime";
import { Form, useFetcher } from "@remix-run/react";
import React, { useState } from "react";
import { getCommonFormData, getRandomColor, useUser } from "~/utils";

import { Button } from "~/components/Button";
import CategoryPill from "~/components/CategoryPill";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "~/components/Input";
import Label from "~/components/Label";
import Main from "~/layout/Main";
import NewCategoryForm from "~/forms/NewCategoryForm";
import Wrapper from "~/layout/Wrapper";
import { createCategory } from "~/models/category.server";
import { faDice } from "@fortawesome/free-solid-svg-icons";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const redirectTo = await formData.get("redirectTo");
  const { title, color } = getCommonFormData(formData, ["title", "color"]);

  await createCategory({ userId, title, color });

  if (redirectTo) {
    console.log("redirecting to", redirectTo);

    return redirect(redirectTo);
  }

  return null;
};

const Category = () => {
  const user = useUser();
  const fetcher = useFetcher();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const { title, color } = await getCommonFormData(formData, [
      "title",
      "color",
    ]);

    fetcher.submit(
      {
        userId: user.id,
        title,
        color,
      },
      { method: "post" }
    );
  };
  return (
    <Wrapper>
      <Main>
        <h1 className="text-3xl font-bold text-gray-800">
          Create a new category
        </h1>

        <NewCategoryForm handleSubmit={handleSubmit} />
      </Main>
    </Wrapper>
  );
};

export default Category;
