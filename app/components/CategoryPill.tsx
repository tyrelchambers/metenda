import type { Category } from "@prisma/client";
import React from "react";

export enum CategoryPillSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

interface CategoryPillProps {
  data: Category;
  isActive?: boolean;
  isActiveClass?: string;
  onClick?: () => void;
  size?: CategoryPillSize;
}

const sizes = {
  [CategoryPillSize.SMALL]: "text-xs",
  [CategoryPillSize.MEDIUM]: "text-sm",
  [CategoryPillSize.LARGE]: "text-base",
};

const CategoryPill = ({
  data,
  isActive,
  isActiveClass,
  onClick,
  size = CategoryPillSize.SMALL,
}: CategoryPillProps) => {
  return (
    <p
      className={`w-fit rounded-full px-4 py-1 ${sizes[size]} ${
        isActive && isActiveClass
      }`}
      style={{
        border: `1.5px solid ${data.color}`,
        backgroundColor: `${data.color}33`,
        color: data.color,
      }}
      onClick={onClick}
    >
      {data.title}
    </p>
  );
};

export default CategoryPill;
