import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import axios from "../../utils/axios";

function BookProperty() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dates, setDates] = useState({ start_date: "", end_date: "" });
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("bookings/", {
            property: id,
            start_date: dates.start_date,
            end_date: dates.end_date
        })
            .then(() => navigate("/user/bookings"))
            .catch(err => {
                console.error(err);
                if (err.response && err.response.data) {
                    setError("Booking failed: " + JSON.stringify(err.response.data));
                } else {
                    setError("Booking failed. Please check dates and try again.");
                }
            });
    };

    return (
        <Container className="mt-5">
            <h2>Book Property</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                        type="date"
                        required
                        onChange={(e) => setDates({ ...dates, start_date: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                        type="date"
                        required
                        onChange={(e) => setDates({ ...dates, end_date: e.target.value })}
                    />
                </Form.Group>
                <Button variant="success" type="submit">Confirm Booking</Button>
            </Form>
        </Container>
    );
}

export default BookProperty;
