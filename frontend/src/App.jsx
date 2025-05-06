import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup'; // Placeholder for now
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';


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
        {/* More routes like /dashboard will go here later */}
      </Routes>
    </Router>
  );
}

export default App;
