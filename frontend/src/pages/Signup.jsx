import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        ...form,
        role: 'user', // You can allow choosing role later if needed
      });
      localStorage.setItem('token', res.data.token);
      alert('Signup successful!');
      navigate('/login'); // Will build this next
    } catch (err) {
      console.error(err);
      alert('Signup failed');
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-500">Signup</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 mb-4 border rounded text-black"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 mb-4 border rounded text-black"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 mb-4 border rounded text-black"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
        <p className="mt-4 text-center text-gray-500">
          Already have an account? <a href="/login" className="text-blue-600">Log in</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
