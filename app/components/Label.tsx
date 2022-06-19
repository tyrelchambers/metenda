import React from "react";

interface LabelProps {
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

const Label = ({ children, className = "", htmlFor, ...props }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-1  text-indigo-500 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;
