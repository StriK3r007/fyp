import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup'; // Placeholder for now
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import BusManagement from "./pages/admin/BusManagement";
// import Unauthorized from './pages/Unauthorized';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute role={['admin', 'driver', 'super-admin', 'user']} component={Dashboard} />}
        />
        <Route path="/user-dashboard" element={<ProtectedRoute role={['user']} component={UserDashboard} />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute role={['admin', 'super-admin']} component={AdminDashboard} />} />
        <Route path="/busmanagement" element={<BusManagement  />} />
        {/* More routes like /dashboard will go here later */}
      </Routes>
    </Router>
  );
}

export default App;
