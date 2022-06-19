import React from "react";

const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`rounded-md border-[1px] border-gray-300 p-2 ${className}`}
      {...props}
    />
  );
};

export default Input;
