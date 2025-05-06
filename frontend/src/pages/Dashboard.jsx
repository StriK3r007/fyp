import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      axios
        .get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error(err);
          localStorage.removeItem('token');
          navigate('/login');
        });
    }
  }, [token, navigate]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>
      <p className="mb-6">You are logged in as: <strong>{user.role}</strong></p>

      {user.role === 'admin' || user.role === 'super-admin' ? (
        <Link to="/admin" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Go to Admin Dashboard
        </Link>
      ) : (
        <Link to="/user" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Go to Your Profile
        </Link>
      )}
    </div>
  );
};

export default Dashboard;
