// src/components/admin/ChangePasswordForm.jsx
import { useState } from "react";
import axios from "axios";

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        // "/api/auth/change-password",
        "http://localhost:5000/api/auth/change-password ",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to update password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Change Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-gray-700"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-gray-700"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-gray-700"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-red-600 font-medium">{message}</p>
      )}
    </div>
  );
}
