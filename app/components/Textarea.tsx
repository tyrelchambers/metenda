import React from "react";

const Textarea = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`rounded-md border-2 border-gray-200 p-2 ${className}`}
      {...props}
    />
  );
};

export default Textarea;
