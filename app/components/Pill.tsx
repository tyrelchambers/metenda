import React from "react";

const Pill = ({ data }) => {
  return (
    <div className="w-fit rounded-full bg-gray-100 px-4 py-1">
      <p className="text-gray-700">{data}</p>
    </div>
  );
};

export default Pill;
