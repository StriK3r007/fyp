import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // most versions work like this


const ProtectedRoute = ({ component: Component, role }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    if (!role.includes(userRole)) {
      return <Navigate to="/login" replace />;
    }

    return <Component />;
  } catch (err) {
    console.error('Invalid token:', err);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
