import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

// roleRequired can be 'USER', 'ADMIN', or null (for just authenticated)
const ProtectedRoute = ({ roleRequired }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roleRequired && user.role !== roleRequired) {
        // If user tries to access admin, redirect to user dashboard, and viceversa
        return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
