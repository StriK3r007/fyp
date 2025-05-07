// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const UserDashboard = () => {
//   const [editMode, setEditMode] = useState(false);
//   const [user, setUser] = useState(null);
//   const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "" });
//   const [message, setMessage] = useState("");

//   const token = localStorage.getItem("token");

//   console.log("Token:", token);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/auth/me", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUser(res.data);
//         // setFormData(res.data);
//         setFormData({ name: res.data.name, email: res.data.email, password: "" });
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUser();
//   }, [token]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSave = async () => {
//     try {
//       const res = await axios.put(
//         `http://localhost:5000/api/auth/${user._id}`,
//         formData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setUser(res.data);
//       setEditMode(false);
//       setFormData({ ...formData, password: "" }); // Clear password field
//       setMessage("Profile updated successfully.");

//     } catch (err) {
//       console.error("Failed to update user:", err);
//     }
//   };

//   if (!user) {
//     return <div className="p-10">Loading profile...</div>;
//   }

//   return (
//     <div className="flex w-screen h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md p-6">
//         <h2 className="text-xl font-bold mb-6">User Dashboard</h2>
//         <nav className="space-y-4">
//           <a href="#" className="block text-blue-600 font-medium">Profile</a>
//           <a href="#" className="block text-gray-600">Settings</a>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-10 overflow-y-auto">
//         <h1 className="text-2xl font-bold mb-6">My Profile</h1>

//         {!editMode ? (
//           <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
//             <p><strong>Name:</strong> {user.name}</p>
//             <p><strong>Email:</strong> {user.email}</p>
//             <p><strong>Role:</strong> {user.role}</p>
//             <button
//               onClick={() => setEditMode(true)}
//               className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Edit Profile
//             </button>
//           </div>
//         ) : (
//           <div className="bg-white p-6 rounded-lg shadow-md max-w-md space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full mt-1 p-2 border rounded"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full mt-1 p-2 border rounded"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Role</label>
//               <input
//                 type="text"
//                 name="role"
//                 value={formData.role}
//                 disabled
//                 className="w-full mt-1 p-2 border rounded bg-gray-100"
//               />
//             </div>

//             <div className="flex gap-4">
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => {
//                   setFormData(user);
//                   setEditMode(false);
//                 }}
//                 className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default UserDashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [showProfile, setShowProfile] = useState(true);
  const [loading, setLoading] = useState(true); // Add a loading state

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched user data:", res.data); // 👈 Add this line
        setUser(res.data);
        // setFormData({ name: res.data.name, email: res.data.email, password: "" });
        setFormData({
          name: res.data?.name || "",
          email: res.data?.email || "",
          password: "",
          confirmPassword: ""
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setMessage("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    console.log('Save button clicked'); // Add this line
    console.log("user in handleSave:", user);
    if (!user?._id) {
      console.error("Error: User ID is undefined. Cannot update.");
      setMessage("Error updating profile: User ID not found.");
      return;
    }

    // Validate password confirmation
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    // Only send fields that changed
    const updatePayload = {
      name: formData.name,
      email: formData.email,
    };
    if (formData.password) updatePayload.password = formData.password;

    console.log("Attempting to update user with ID:", user._id, "and data:", formData);
    try {
      

      const res = await axios.put(`/api/auth/${user._id}`, updatePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setEditMode(false);
      setShowProfile(true);
      setFormData({ ...formData, password: "", confirmPassword: ""});
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("Error updating profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = '/login';
  };

  const showEditProfile = () => {
    setEditMode(true);
    setShowProfile(false);
    setMessage("");
  };

  const showUserProfile = () => {
    setEditMode(false);
    setShowProfile(true);
    setMessage("");
    setFormData({ name: user?.name || "", email: user?.email || "", password: "" });
  };

  if (loading) {
    console.log("Still loading...");
    return <div className="p-10">Loading profile...</div>;
  }

  if (!user) {
    console.log("User not loaded");
    return <div className="p-10">Failed to load user data.</div>;
  }

  return (
    <div className="flex w-screen h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">User Dashboard</h2>
        <nav className="space-y-4">
          <button onClick={showUserProfile} className="block text-blue-600 font-medium focus:outline-none">
            Profile
          </button>
          <button onClick={showEditProfile} className="block text-gray-600 hover:text-blue-600 focus:outline-none">
            Edit Profile
          </button>
          <a href="#" className="block text-gray-600 hover:text-blue-600 focus:outline-none">Settings</a>
          <button onClick={handleLogout} className="block text-red-600 hover:text-red-700 focus:outline-none">
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        {showProfile && (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md space-y-4">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {user.role && <p><strong>Role:</strong> {user.role}</p>}
          </div>
        )}

        {!showProfile && (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md space-y-4">
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded text-gray-700"
                placeholder="Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded text-gray-700"
                placeholder="Email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded text-gray-700"
                placeholder="Leave blank to keep old password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded text-gray-700"
                placeholder="Confirm New password"
              />
            </div>

            {message && <p className="text-center text-sm text-green-600">{message}</p>}

            <div className="flex gap-4 mt-4">
              <button
                onClick={handleSave}
                // disabled={loading || !user?._id} // Disable if loading or no user ID
                // disabled={loading || !user || !user._id}
                disabled={loading}
                className={`px-4 py-2 text-white rounded hover:bg-green-700 ${
                  loading || !user?._id ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600'
                }`}
              >
                Save
              </button>
              <button
                onClick={showUserProfile}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;