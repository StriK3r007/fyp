// // src/components/admin/DriverManagement.jsx
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function DriverManagement() {
//   const [drivers, setDrivers] = useState([]);
//   const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
//   const [editingId, setEditingId] = useState(null);
//   const token = localStorage.getItem("token");

//   const fetchDrivers = async () => {
//     try {
//       const res = await axios.get("/api/drivers", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setDrivers(res.data);
//     } catch (err) {
//       console.error("Error fetching drivers:", err);
//     }
//   };

//   useEffect(() => {
//     fetchDrivers();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingId) {
//         await axios.put(`/api/drivers/${editingId}`, formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       } else {
//         await axios.post("/api/drivers", formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       }
//       setFormData({ name: "", email: "", phone: "" });
//       setEditingId(null);
//       fetchDrivers();
//     } catch (err) {
//       console.error("Error saving driver:", err);
//     }
//   };

//   const handleEdit = (driver) => {
//     setFormData({ name: driver.name, email: driver.email, phone: driver.phone });
//     setEditingId(driver._id);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this driver?")) return;
//     try {
//       await axios.delete(`/api/drivers/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchDrivers();
//     } catch (err) {
//       console.error("Error deleting driver:", err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4 text-gray-800">Driver Management</h2>
//       <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
//         <input
//           type="text"
//           placeholder="Name"
//           className="w-full p-2 border rounded text-gray-700"
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full p-2 border rounded text-gray-700"
//           value={formData.email}
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Phone"
//           className="w-full p-2 border rounded text-gray-700"
//           value={formData.phone}
//           onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//         />
//         <button
//           type="submit"
//           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
//         >
//           {editingId ? "Update" : "Add"} Driver
//         </button>
//       </form>

//       <table className="mt-6 w-full bg-white rounded shadow overflow-hidden">
//         <thead className="bg-gray-100 text-left">
//           <tr>
//             <th className="p-2">Name</th>
//             <th className="p-2">Email</th>
//             <th className="p-2">Phone</th>
//             <th className="p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {drivers.map((driver) => (
//             <tr key={driver._id} className="border-t">
//               <td className="p-2">{driver.name}</td>
//               <td className="p-2">{driver.email}</td>
//               <td className="p-2">{driver.phone}</td>
//               <td className="p-2 space-x-2">
//                 <button
//                   className="text-blue-600 hover:underline"
//                   onClick={() => handleEdit(driver)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="text-red-600 hover:underline"
//                   onClick={() => handleDelete(driver._id)}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", busId: "", licenseNumber: ""});
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchDrivers = async () => {
    try {
      const res = await axios.get("/api/drivers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDrivers(res.data);
    } catch (err) {
      console.error("Failed to fetch drivers:", err);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`/api/drivers/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/drivers", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ name: "", email: "", phone: "", busId: "", licenseNumber: "" });
      setEditingId(null);
      fetchDrivers();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleEdit = (driver) => {
    setForm({ name: driver.name, 
      email: driver.email, 
      phone: driver.phone,
      busId: driver.busId || "", // Add busId and licenseNumber to the edit form as well
      licenseNumber: driver.licenseNumber || "",
    });
    setEditingId(driver._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this driver?")) return;
    try {
      await axios.delete(`/api/drivers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDrivers();
    } catch (err) {
      console.error("Error deleting driver:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Manage Drivers</h2>

      <div className="space-y-2 max-w-md">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded text-gray-700"
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded text-gray-700"
        />
        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded text-gray-700"
        />
        <input
          name="busId"
          placeholder="Bus ID"
          value={form.busId}
          onChange={handleChange}
          className="w-full border p-2 rounded text-gray-700"
        />
        <input
          name="licenseNumber"
          placeholder="License Number"
          value={form.licenseNumber}
          onChange={handleChange}
          className="w-full border p-2 rounded text-gray-700"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {editingId ? "Update Driver" : "Add Driver"}
        </button>
      </div>

      <table className="w-full mt-6 border-collapse border-2 border-green-500 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border border-green-500 text-black">Name</th>
            <th className="p-2 border border-green-500 text-black">Email</th>
            <th className="p-2 border border-green-500 text-black">Phone</th>
            <th className="p-2 border border-green-500 text-black">Bus ID</th>
            <th className="p-2 border border-green-500 text-black">License Number</th>
            <th className="p-2 border border-green-500 text-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver._id}>
              <td className="p-2 border border-green-500 text-gray-800">{driver.name}</td>
              <td className="p-2 border border-green-500 text-gray-800">{driver.email}</td>
              <td className="p-2 border border-green-500 text-gray-800">{driver.phone}</td>
              <td className="p-2 border border-green-500 text-gray-800">{driver.busId}</td>
              <td className="p-2 border border-green-500 text-gray-800">{driver.licenseNumber}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleEdit(driver)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(driver._id)}
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

export default DriverManagement;