import React, { useEffect, useState, useContext } from "react";
import { Table, Badge, Spinner, Container, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axios from "../../utils/axios";

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // Axios interceptor handles Authorization header
                const response = await axios.get("/bookings/");
                setBookings(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                setError("Failed to load your bookings. Please try logging in again.");
                setLoading(false);
            }
        };

        if (user) {
            fetchBookings();
        }
    }, [user]);

    if (loading) return (
        <Container className="text-center mt-5">
            <Spinner animation="border" />
            <p className="mt-2">Loading your bookings...</p>
        </Container>
    );

    if (error) return (
        <Container className="text-center mt-5">
            <Alert variant="danger">{error}</Alert>
        </Container>
    );

    return (
        <Container className="mt-4">
            <h2 className="mb-4">My Bookings</h2>
            {!bookings || bookings.length === 0 ? (
                <div className="text-center p-5 bg-light rounded">
                    <h4>No bookings yet?</h4>
                    <p className="text-muted">You haven't booked any properties yet.</p>
                    <Button as={Link} to="/properties" variant="primary">Browse Properties</Button>
                </div>
            ) : (
                <Table striped bordered hover responsive className="shadow-sm bg-white">
                    <thead className="bg-light">
                        <tr>
                            <th>ID</th>
                            <th>Property</th>
                            <th>Dates</th>
                            <th>Duration</th>
                            <th>Total Cost</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>#{booking.id}</td>
                                <td>
                                    {booking.property_details ? (
                                        <Link to={`/properties/${booking.property_details.id}`} className="text-decoration-none">
                                            {booking.property_details.title}
                                        </Link>
                                    ) : 'Unknown Property'}
                                </td>
                                <td>{booking.start_date} <span className="text-muted">to</span> {booking.end_date}</td>
                                <td>{booking.months} month{booking.months > 1 ? 's' : ''}</td>
                                <td><strong>₹{booking.total_amount}</strong></td>
                                <td>
                                    <Badge
                                        bg={
                                            booking.status === 'CONFIRMED' ? 'success' :
                                                booking.status === 'REJECTED' ? 'danger' : 'warning'
                                        }
                                    >
                                        {booking.status}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default MyBookings;
