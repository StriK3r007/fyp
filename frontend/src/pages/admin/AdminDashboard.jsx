// src/components/admin/AdminDashboard.jsx
import { useState } from "react";
import { LayoutDashboard, Bus, Users, MapPin, Lock, LogOut, Map } from "lucide-react";
import BusManagement from "../admin/BusManagement"; // Import BusManagement
import DriverManagement from "../admin/DriverManagement"; // Import DriverManagement
import StopManagement from "../admin/StopManagement"; // Import DriverManagement
import ChangePasswordForm from "../admin/ChangePasswordForm"; 
import MapView from "../admin/MapView"; //MapView


const navItems = [
  { label: "Dashboard", icon: <LayoutDashboard />, view: "analytics" },
  { label: "Buses", icon: <Bus />, view: "buses" },
  { label: "Drivers", icon: <Users />, view: "drivers" },
  { label: "Stops", icon: <MapPin />, view: "stops" },
  { label: "MapView", icon: <Map />, view: "map" },
  { label: "Change Password", icon: <Lock />, view: "changePassword" },
];

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("analytics");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex w-screen h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6 text-center text-green-500">Admin Panel</h1>
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view)}
            className={`flex items-center space-x-2 w-full text-left p-2 rounded hover:bg-gray-700 ${
              activeView === item.view ? "bg-gray-700" : ""
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 w-full text-left p-2 rounded bg-red-600 hover:bg-red-700"
        >
          <LogOut />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {activeView === "analytics" && <div>Analytics summary goes here...</div>}
        {activeView === "buses" && <BusManagement />}
        {activeView === "drivers" && <DriverManagement />}
        {/* {activeView === "stops" && <div>Stops management CRUD component</div>} */}
        {activeView === "stops" && <StopManagement />}
        {activeView === "map" && <MapView />}
        {activeView === "changePassword" && <ChangePasswordForm />}
      </main>
    </div>
  );
}
