import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import AdminLayout from "./layouts/AdminLayout";

// Routes config
import AdminRoute from "./routes/AdminRoute";
import UserRoute from "./routes/UserRoute"; // Renamed from ProtectedRoute

// Components
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// User Pages
import UserDashboard from "./pages/user/Dashboard";
import UserBookings from "./pages/user/Bookings";
import UserFavorites from "./pages/user/Favorites";
import UserProfile from "./pages/user/Profile";
import BookProperty from "./pages/user/BookProperty";
import PropertyDetails from "./pages/common/PropertyDetails";
import Properties from "./pages/common/Properties";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProperties from "./pages/admin/Properties";
import AdminBookings from "./pages/admin/Bookings";
import AdminUsers from "./pages/admin/Users";
import AdminAdmins from "./pages/admin/Admins";
import AdminProfile from "./pages/admin/Profile";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes - Wrapped in Fragment to include Navbar? Or maybe UserLayout later */}
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<><Navbar /><Properties /></>} />
          <Route path="/properties/:id" element={<><Navbar /><PropertyDetails /></>} />
          <Route path="/login" element={<><Navbar /><Login /></>} />
          <Route path="/register" element={<><Navbar /><Register /></>} />

          {/* User Routes */}
          <Route element={<UserRoute roleRequired="USER" />}>
            <Route path="/book-property/:id" element={<><Navbar /><BookProperty /></>} />
            <Route path="/user/dashboard" element={<><Navbar /><UserDashboard /></>} />
            <Route path="/user/bookings" element={<><Navbar /><UserBookings /></>} />
            <Route path="/user/favorites" element={<><Navbar /><UserFavorites /></>} />
            <Route path="/user/profile" element={<><Navbar /><UserProfile /></>} />
          </Route>

          {/* Admin Routes - Uses AdminLayout */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="admins" element={<AdminAdmins />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
