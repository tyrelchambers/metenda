import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import {
  faBoxesStacked,
  faDiagramProject,
  faHome,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";

import { FontawesomeObject } from "@fortawesome/fontawesome-svg-core";
import { NavLink } from "@remix-run/react";
import React from "react";

interface ILink {
  to: string;
  label: string;
  icon: any;
}

const links: ILink[] = [
  {
    to: "/agenda",
    label: "Home",
    icon: faHome,
  },
  {
    to: "/tasks",
    label: "Tasks",
    icon: faTasks,
  },
  {
    to: "/categories",
    label: "Categories",
    icon: faBoxesStacked,
  },
];

const DashNav = () => {
  return (
    <div className="flex flex-col gap-6">
      {links.map((link) => (
        <NavLink
          key={link.label}
          to={link.to}
          className={({ isActive }) =>
            isActive
              ? "flex items-center gap-6  text-white"
              : "flex items-center gap-6  text-gray-400 transition-all hover:text-white"
          }
        >
          <FontAwesomeIcon icon={link.icon} style={{ width: "17px" }} />
          {link.label}
        </NavLink>
      ))}
    </div>
  );
};

export default DashNav;
