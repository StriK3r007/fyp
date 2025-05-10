import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/buses", label: "Buses" },
    { path: "/admin/drivers", label: "Drivers" },
    { path: "/admin/stops", label: "Stops" },
    { path: "/admin/map", label: "Map View" },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `block p-2 rounded hover:bg-gray-700 ${
              isActive ? "bg-gray-700" : ""
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}
