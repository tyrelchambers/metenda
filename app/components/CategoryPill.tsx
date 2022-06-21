import { Category } from "@prisma/client";
import React from "react";

interface CategoryPillProps {
  data: Category;
  isActive?: boolean;
  isActiveClass?: string;
  onClick?: () => void;
}

const CategoryPill = ({
  data,
  isActive,
  isActiveClass,
  onClick,
}: CategoryPillProps) => {
  return (
    <p
      className={`w-fit rounded-full px-4 py-1 text-sm ${
        isActive && isActiveClass
      }`}
      style={{
        backgroundColor: data.color,
        color: data.textColor,
      }}
      onClick={onClick}
    >
      {data.title}
    </p>
  );
};

export default CategoryPill;
