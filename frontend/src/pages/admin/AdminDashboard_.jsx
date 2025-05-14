import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState({ buses: 0, drivers: 0, stops: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [busRes, driverRes, stopRes] = await Promise.all([
          axios.get("/api/buses"),
          axios.get("/api/drivers"),
          axios.get("/api/stops"),
        ]);
        setAnalytics({
          buses: busRes.data.length,
          drivers: driverRes.data.length,
          stops: stopRes.data.length,
        });
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar onLogout={() => {/* add logout logic */}} />
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-500 text-white p-6 rounded shadow">Buses: {analytics.buses}</div>
          <div className="bg-green-500 text-white p-6 rounded shadow">Drivers: {analytics.drivers}</div>
          <div className="bg-yellow-500 text-white p-6 rounded shadow">Stops: {analytics.stops}</div>
        </div>
      </div>
    </div>
  );
}
