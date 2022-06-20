import React from "react";

const Pill = ({ data, isActive, isActiveClass, onClick }) => {
  return (
    <p
      className={`w-fit rounded-full bg-gray-100 px-4 py-1 text-sm ${
        isActive && isActiveClass
      }`}
      onClick={onClick}
    >
      {data}
    </p>
  );
};

export default Pill;
