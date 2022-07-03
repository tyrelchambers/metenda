import React from "react";

interface Props {
  type: "h1" | "h2" | "h3";
  children: JSX.Element | JSX.Element[] | string;
}
const h1 = (props) => (
  <h1 className="text-3xl font-bold text-gray-800">{props.children}</h1>
);

export const Heading = ({ type, children }: Props) => {
  return h1({ children });
};
