import React from "react";

const Textarea = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`rounded-md border-2 border-gray-200 p-2 text-sm font-thin text-gray-700 ${className}`}
      {...props}
    />
  );
};

export default Textarea;
