import {
  faBoxesStacked,
  faHome,
  faTasks,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "@remix-run/react";

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

const linkGroup2: ILink[] = [
  {
    to: "/profile",
    label: "Profile",
    icon: faUser,
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
      <hr className=" border-gray-600" />
      {linkGroup2.map((link) => (
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
