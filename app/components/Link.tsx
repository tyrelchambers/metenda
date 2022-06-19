import { LinkProps, Link as RemixLink } from "@remix-run/react";

import React from "react";

const Link = ({ to, className = "", children }: LinkProps) => {
  return (
    <RemixLink to={to} className={`text-indigo-500 underline ${className}`}>
      {children}
    </RemixLink>
  );
};

export default Link;
