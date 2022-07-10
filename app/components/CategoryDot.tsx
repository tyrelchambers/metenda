import { Tooltip } from "@mantine/core";
import { Category } from "@prisma/client";
import React from "react";

const CategoryDot = ({
  color,
  title,
}: {
  color: Category["color"];
  title: Category["title"];
}) => {
  console.log(color);

  return (
    <Tooltip
      label={title}
      withArrow
      className="w-full"
      style={{
        width: "20px",
        height: "4px",
        backgroundColor: color,
        borderRadius: "10px",
      }}
    >
      <></>
    </Tooltip>
  );
};

export default CategoryDot;
