import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const role = localStorage.getItem('role');
    return role === 'ADMIN' ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
