import React from "react";
import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/profile", label: "profile" },
  { to: "/order", label: "order" },
  { to: "/notifications", label: "notification" },
  { to: "/complaint", label: "complaint" },
];

export default function ProfileNav() {
  return (
    <div className="bg-white px-5 mb-5 py-3 rounded-sm overflow-x-scroll sm:overflow-x-hidden flex gap-2">
      {LINKS.map(({ to, label }) => (
        <p key={to}>
          <NavLink
            to={to}
            end
            className={({ isActive }) => `mr-2 ${isActive ? "text-indigo-600 font-semibold" : "text-gray-600 hover:text-indigo-600"}`}
          >
            {label}
          </NavLink>
          /
        </p>
      ))}
    </div>
  );
}
