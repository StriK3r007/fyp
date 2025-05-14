// src/pages/admin/StopManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const StopManagement = () => {
  const [stops, setStops] = useState([]);
  const [form, setForm] = useState({ name: "", latitude: "", longitude: "", route: "" });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchStops = async () => {
    try {
      const res = await axios.get("/api/stops", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStops(res.data);
    } catch (err) {
      console.error("Failed to fetch stops:", err);
    }
  };

  useEffect(() => {
    fetchStops();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`/api/stops/${editingId}`, {
          name: form.name,
          location: {
            latitude: parseFloat(form.latitude),
            longitude: parseFloat(form.longitude),
          },
          route: form.route,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/stops", {
          name: form.name,
          location: {
            latitude: parseFloat(form.latitude),
            longitude: parseFloat(form.longitude),
          },
          route: form.route,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ name: "", latitude: "", longitude: "", route: "" });
      setEditingId(null);
      fetchStops();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleEdit = (stop) => {
    setForm({
      name: stop.name,
      latitude: stop.location.latitude,
      longitude: stop.location.longitude,
      route: stop.route,
    });
    setEditingId(stop._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/stops/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStops();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Stops</h2>

      <div className="space-y-2 max-w-md">
        <input
          name="name"
          placeholder="Stop Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded text-gray-700"
        />
        <input
          name="latitude"
          placeholder="Latitude"
          type="number"
          value={form.latitude}
          onChange={handleChange}
          className="w-full border p-2 rounded text-gray-700"
        />
        <input
          name="longitude"
          placeholder="Longitude"
          type="number"
          value={form.longitude}
          onChange={handleChange}
          className="w-full border p-2 rounded text-gray-700"
        />
        <input
          name="route"
          placeholder="Route"
          value={form.route}
          onChange={handleChange}
          className="w-full border p-2 rounded text-gray-700"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {editingId ? "Update Stop" : "Add Stop"}
        </button>
      </div>

      <table className="w-full mt-6 border-collapse border-2 border-green-500 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border border-green-500 text-black">Name</th>
            <th className="p-2 border border-green-500 text-black">Latitude</th>
            <th className="p-2 border border-green-500 text-black">Longitude</th>
            <th className="p-2 border border-green-500 text-black">Route</th>
            <th className="p-2 border border-green-500 text-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stops.map((stop) => (
            <tr key={stop._id}>
              <td className="p-2 border border-green-500 text-gray-800">{stop.name}</td>
              <td className="p-2 border border-green-500 text-gray-800">{stop.location.latitude}</td>
              <td className="p-2 border border-green-500 text-gray-800">{stop.location.longitude}</td>
              <td className="p-2 border border-green-500 text-gray-800">{stop.route}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleEdit(stop)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(stop._id)}
                  className="px-2 py-1 text-red-600 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StopManagement;