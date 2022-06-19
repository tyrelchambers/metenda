import { Link, useFetcher } from "@remix-run/react";
import { faMinusCircle, faPencil } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const CategoryList = ({ category }) => {
  const fetcher = useFetcher();

  const onChangeHandler = (checked) => {
    fetcher.submit(
      { id: category.id, done: checked, type: "toggleDone" },
      { method: "post" }
    );
  };

  const deleteHandler = () => {
    fetcher.submit({ id: category.id, type: "delete" }, { method: "post" });
  };
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
        <fetcher.Form method="delete">
          <button onClick={deleteHandler}>
            <FontAwesomeIcon
              icon={faMinusCircle}
              className="text-gray-500 transition-all hover:text-red-500"
            />
          </button>
        </fetcher.Form>
      </div>
    </li>
  );
};

export default CategoryList;
