import { Category } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MultiSelect } from "@mantine/core";
import Popover from "./PopOver";
import React from "react";
import { faCalendarDay } from "@fortawesome/pro-light-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useModal } from "~/stores/useModal";

const CategoriesSelector = ({
  categories,
  categoriesHandler,
  selectedCategories,
}) => {
  const modalState = useModal((state) => state);

  return (
    <Popover
      triggerLabel={
        <>
          <FontAwesomeIcon
            icon={faCalendarDay}
            className="mr-2"
            style={{ width: "18px" }}
          />
          Categories
        </>
      }
    >
      <div className="flex justify-between">
        <p className="text-lg font-medium text-gray-900">
          <FontAwesomeIcon
            icon={faCalendarDay}
            className="mr-2"
            style={{ width: "18px" }}
          />
          Categories
        </p>
        <div className="w-fit">
          <button
            type="button"
            onClick={() => modalState.open()}
            className="text-indigo-500"
          >
            <FontAwesomeIcon icon={faPlus} style={{ width: "14px" }} />
          </button>
        </div>
      </div>

      {categories.length === 0 && (
        <p className="text-sm italic text-gray-400">
          There aren't any categories. You can create one.
        </p>
      )}
      {categories.length > 0 && (
        <MultiSelect
          data={categories.map((c: Category) => ({
            value: c.id,
            label: c.title,
          }))}
          placeholder="Pick your categories"
          onChange={(e) => categoriesHandler(e)}
          className="mt-4"
          value={selectedCategories}
        />
      )}
    </Popover>
  );
};

export default CategoriesSelector;
