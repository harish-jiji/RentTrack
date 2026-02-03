import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { Table, Button, Badge } from "react-bootstrap";

export default function Bookings() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = () => {
        axios.get("/admin/bookings/").then(res => setBookings(res.data));
    };

    const handleAction = (id, action) => { // action = 'approve' or 'reject'
        axios.put(`/admin/bookings/${id}/${action}/`).then(() => fetchBookings());
    };

    return (
        <div>
            <h2 className="fw-bold mb-4">Manage Bookings</h2>
            <Table striped hover responsive className="bg-white shadow-sm rounded">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Property</th>
                        <th>User</th>
                        <th>Dates</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(b => (
                        <tr key={b.id}>
                            <td>{b.id}</td>
                            <td>{b.property_title}</td>
                            <td>{b.user_username}</td>
                            <td>{b.start_date} to {b.end_date}</td>
                            <td>₹{b.total_amount}</td>
                            <td>
                                <Badge bg={b.status === 'CONFIRMED' ? 'success' : b.status === 'REJECTED' ? 'danger' : 'warning'}>
                                    {b.status}
                                </Badge>
                            </td>
                            <td>
                                {b.status === 'PENDING' && (
                                    <>
                                        <Button size="sm" variant="success" className="me-2" onClick={() => handleAction(b.id, 'approve')}>Approve</Button>
                                        <Button size="sm" variant="danger" onClick={() => handleAction(b.id, 'reject')}>Reject</Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
