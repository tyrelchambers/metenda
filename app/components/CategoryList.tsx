import { Form, Link, useFetcher } from "@remix-run/react";
import { faMinusCircle, faPencil } from "@fortawesome/free-solid-svg-icons";

import { Category } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const CategoryList = ({ category }: { category: Category }) => {
  return (
    <li
      key={category.id}
      className="flex items-center justify-between border-b-[1px] border-gray-200 py-4"
    >
      <p className="text-gray-800">{category.title}</p>
      <div className="flex items-center gap-4">
        <Link to={`/category/${category.id}/edit`}>
          <FontAwesomeIcon
            icon={faPencil}
            className="text-gray-500 transition-all hover:text-green-500"
          />
        </Link>
        <Form method="delete" action={`/category/${category.id}/delete`}>
          <button type="submit">
            <FontAwesomeIcon
              icon={faMinusCircle}
              className="text-gray-500 transition-all hover:text-red-500"
            />
          </button>
          <input type="text" hidden name="id" value={category.id} />
        </Form>
      </div>
    </li>
  );
};

export default CategoryList;
