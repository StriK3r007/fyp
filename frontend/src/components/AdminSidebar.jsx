import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
      <nav className="space-y-4">
        <Link to="/admin/buses" className="block hover:text-blue-400">
          🚍 Manage Buses
        </Link>
        {/* You'll later add: /admin/drivers, /admin/stops, /admin/map */}
      </nav>
    </div>
  );
};

export default AdminSidebar;
