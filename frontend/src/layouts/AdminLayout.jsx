import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { Container } from "react-bootstrap";

export default function AdminLayout() {
    return (
        <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
            <AdminSidebar />
            <div className="flex-grow-1 overflow-auto bg-light">
                <Container fluid className="p-4">
                    <Outlet />
                </Container>
            </div>
        </div>
    );
}
