import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Nav, Button } from "react-bootstrap";
// You can import icons here if you install react-icons, standard bootstrap for now

export default function AdminSidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="bg-dark text-white p-3 d-flex flex-column vh-100" style={{ width: "250px", minHeight: "100vh" }}>
            <h4 className="mb-4 text-center fw-bold">RentTrack <span className="text-warning">Admin</span></h4>

            <Nav className="flex-column gap-2 mb-auto">
                <Link to="/admin/dashboard" className="nav-link text-white hover-light">
                    📊 Dashboard
                </Link>
                <Link to="/admin/properties" className="nav-link text-white hover-light">
                    🏠 Properties
                </Link>
                <Link to="/admin/bookings" className="nav-link text-white hover-light">
                    📅 Bookings
                </Link>
                <Link to="/admin/users" className="nav-link text-white hover-light">
                    👥 Users
                </Link>
                <Link to="/admin/admins" className="nav-link text-white hover-light">
                    🛡️ Manage Admins
                </Link>
                <Link to="/admin/profile" className="nav-link text-white hover-light">
                    👤 Profile
                </Link>
            </Nav>

            <Button variant="danger" className="mt-4 w-100" onClick={handleLogout}>
                🚪 Logout
            </Button>
        </div>
    );
}
