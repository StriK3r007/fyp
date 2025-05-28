import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const role = res.data.user.role;

      localStorage.setItem('token', res.data.token); // store token
      localStorage.setItem('role', res.data.role);   // store role (admin, user, etc.)
      
      
      if (role === 'admin' || role === 'super-admin') {
        navigate('/admin-dashboard');
      } else if (role === 'user') {
        navigate('/user-dashboard');
      } else if (role === 'driver') {
        navigate('/driver/dashboard');
      } else {
        navigate('/unauthorized');
      }

      // alert('Login successful');
      // navigate('/dashboard'); // redirect to dashboard
    } catch (err) {
      console.error(err);
      alert('Login failed: ' + err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-500">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded text-black"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account? <a href="/signup" className="text-blue-600 underline">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;