// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import ProtectedRoute from './router/ProtectedRoute';

// import Login from './pages/Login';
// import UserDashboard from './pages/UserDashboard';
// import AdminDashboard from './pages/AdminDashboard';
// import Unauthorized from './pages/Unauthorized';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/unauthorized" element={<Unauthorized />} />

//         {/* Protected routes */}
//         <Route path="/user-dashboard" element={<ProtectedRoute role={['user']} component={UserDashboard} />} />
//         <Route path="/admin-dashboard" element={<ProtectedRoute role={['admin', 'super-admin']} component={AdminDashboard} />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
