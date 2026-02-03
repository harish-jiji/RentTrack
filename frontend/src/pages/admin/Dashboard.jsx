import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { Row, Col, Card } from "react-bootstrap";

export default function Dashboard() {
    const [stats, setStats] = useState({
        total_users: 0,
        total_properties: 0,
        active_bookings: 0,
        pending_bookings: 0
    });

    useEffect(() => {
        axios.get("/admin/dashboard/")
            .then(res => setStats(res.data))
            .catch(err => console.error(err));
    }, []);

    const StatCard = ({ title, value, color }) => (
        <Col md={3} className="mb-4">
            <Card className={`text-white bg-${color} h-100 shadow`}>
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                    <h3 className="fw-bold display-4">{value}</h3>
                    <div className="text-uppercase fw-bold">{title}</div>
                </Card.Body>
            </Card>
        </Col>
    );

    return (
        <div>
            <h2 className="mb-4 fw-bold">Dashboard Overview</h2>
            <Row>
                <StatCard title="Total Users" value={stats.total_users} color="info" />
                <StatCard title="Properties" value={stats.total_properties} color="success" />
                <StatCard title="Active Bookings" value={stats.active_bookings} color="primary" />
                <StatCard title="Pending Requests" value={stats.pending_bookings} color="warning" />
            </Row>

            {/* You can add charts here later */}
        </div>
    );
}
