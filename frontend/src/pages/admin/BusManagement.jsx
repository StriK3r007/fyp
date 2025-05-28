// src/pages/admin/BusManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast';

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState({ number: "", route: "", capacity: "" });
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track if updating
  const token = localStorage.getItem("token");

  const fetchBuses = async () => {
    try {
      const res = await axios.get("/api/buses", {
        headers: { Authorization: `Bearer ${token}` },  
      });
      setBuses(res.data);
    } catch (err) {
      console.error("Failed to fetch buses:", err);
      toast.error("Failed to fetch buses:", err);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true); // Disable form buttons during submission
    try {
      if (editingId) {
        await axios.put(`/api/buses/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/buses", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ number: "", route: "", capacity: "" });
      setEditingId(null);
      fetchBuses();
      toast.success(editingId ? 'Bus updated successfully!' : 'Bus added successfully!'); // Show success toast
    } catch (err) {
      console.error("Save failed:", err);
      toast.error(err.response?.data?.message || 'Failed to save bus.'); // Show error toast
    } finally {
      setIsSubmitting(false); // Re-enable form buttons after submission
    }
  };

  const handleEdit = (bus) => {
    setForm({ number: bus.number, route: bus.route, capacity: bus.capacity });
    setEditingId(bus._id);
  };

  const handleCancelEdit = () => {
    setForm({ number: "", route: "", capacity: "" });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (isSubmitting) {
      return; // Prevent deletion while updating
    }
    if (!window.confirm("Delete this Bus?")) return;
    try {
      await axios.delete(`/api/buses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBuses();
      toast.success('Bus deleted successfully!'); // Show success toast
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err.response?.data?.message || 'Failed to delete bus.'); // Show error toast
    }
  };

  const isRowActionDisabled = !!editingId || isSubmitting;


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Manage Buses</h2>

      <div className="space-y-2 max-w-md">
        <input
          name="number"
          placeholder="Bus Number"
          value={form.number}
          onChange={handleChange}
          className="w-full border-2 border-green-600 p-2 rounded text-gray-700"
        />
        <input
          name="route"
          placeholder="Route"
          value={form.route}
          onChange={handleChange}
          className="w-full border-2 border-green-600 p-2 rounded text-gray-700"
        />
        <input
          name="capacity"
          placeholder="Capacity"
          min="0"
          type="number"
          value={form.capacity}
          onChange={handleChange}
          className="w-full border-2 border-green-600 p-2 rounded text-gray-700"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={isSubmitting}
        >
          {editingId ? "Update Bus" : "Add Bus"}
        </button>
        {editingId && (
          <button
            onClick={handleCancelEdit}
            className="px-4 py-2 bg-gray-400 text-white rounded ml-2"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>

      <table className="w-full mt-6 border-2 border-green-500 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border border-green-500 text-black">Number</th>
            <th className="p-2 border border-green-500 text-black">Route</th>
            <th className="p-2 border border-green-500 text-black">Capacity</th>
            <th className="p-2 border border-green-500 text-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus._id}>
              <td className="p-2 border border-green-500 text-gray-800">{bus.number}</td>
              <td className="p-2 border border-green-500 text-gray-800">{bus.route}</td>
              <td className="p-2 border border-green-500 text-gray-800">{bus.capacity}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleEdit(bus)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                  disabled={isRowActionDisabled}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(bus._id)}
                  className="px-2 py-1 text-red-600  rounded"
                  disabled={isRowActionDisabled}
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

export default BusManagement;