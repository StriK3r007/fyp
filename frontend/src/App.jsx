// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';

// import Login from './pages/Login';
// import Signup from './pages/Signup'; // Placeholder for now
// import Dashboard from './pages/Dashboard';
// import ProtectedRoute from './routes/ProtectedRoute';
// import UserDashboard from './pages/UserDashboard';
// import AdminDashboard from './pages/admin/AdminDashboard';
// import BusManagement from "./pages/admin/BusManagement";
// import DriverDashboard from "./pages/driver/DriverDashboard";
// import MapView from './pages/admin/MapView';
// // import Unauthorized from './pages/Unauthorized';


// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" />} />
//         {/* <Route path="/" element={<Navigate to="/mapview" />} /> */}
//         {/* <Route path="/mapview" element={<MapView />} /> */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         {/* <Route
//           path="/dashboard"
//           element={<ProtectedRoute role={['admin', 'driver', 'super-admin', 'user']} component={Dashboard} />}
//         /> */}
//         <Route path="/user-dashboard" element={<ProtectedRoute role={['user']} component={UserDashboard} />} />
//         <Route path="/admin-dashboard" element={<ProtectedRoute role={['admin', 'super-admin']} component={AdminDashboard} />} />
//         <Route path="/busmanagement" element={<BusManagement  />} />
//         <Route path="/driver/dashboard" element={<DriverDashboard />} />
//         {/* More routes like /dashboard will go here later */}
//       </Routes>
//       <Toaster />
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import Signup from './pages/Signup'; // Placeholder for now
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import BusManagement from "./pages/admin/BusManagement";
import DriverDashboard from "./pages/driver/DriverDashboard";
import MapView from './components/MapComponent';
// import Unauthorized from './pages/Unauthorized';


function App() {
  return (
    <Router>
      <Routes>
        {/* Navigate from the root path directly to /mapview */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route
          path="/dashboard"
          element={<ProtectedRoute role={['admin', 'driver', 'super-admin', 'user']} component={Dashboard} />}
        /> */}
        <Route path="/user-dashboard" element={<ProtectedRoute role={['user']} component={UserDashboard} />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute role={['admin', 'super-admin']} component={AdminDashboard} />} />
        <Route path="/busmanagement" element={<BusManagement />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        {/* More routes like /dashboard will go here later */}
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;