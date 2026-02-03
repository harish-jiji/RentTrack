import React, { useEffect, useState, useContext } from "react";
import { Card, Button, Row, Col, Spinner, Modal, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axios from "../../utils/axios";

export default function ViewProperties() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/properties/");
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      await axios.delete(`/properties/${id}/`);
      setProperties(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete");
    }
  };

  const handleBookClick = (property) => {
    setSelectedProperty(property);
    setShowBookingModal(true);
    setBookingError("");
    setBookingSuccess("");
  };

  const calculateMonths = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e - s);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Approximate months
    const months = diffDays / 30;
    return Math.max(1, Math.round(months));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError("");
    const months = calculateMonths(startDate, endDate);
    const totalAmount = months * selectedProperty.price_per_month;

    try {
      await axios.post("/bookings/", {
        property: selectedProperty.id,
        start_date: startDate,
        end_date: endDate,
        months: months,
        total_amount: totalAmount
      });

      setBookingSuccess("Booking request sent successfully! Check 'My Bookings'.");
      setTimeout(() => setShowBookingModal(false), 2000);
    } catch (error) {
      const errMsg = error.response?.data ? JSON.stringify(error.response.data) : "Something went wrong.";
      setBookingError(errMsg);
    }
  };

  const handleFavorite = async (propertyId) => {
    try {
      await axios.post("/favorites/", { property: propertyId });
      alert("Added to favorites!");
    } catch (error) {
      console.error(error);
      alert("Failed to add or already added.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3">Property Listings</h2>

      <Button variant="primary" onClick={fetchProperties} disabled={loading} className="mb-3">
        {loading ? "Refreshing..." : "Refresh List"}
      </Button>

      {loading && (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      )}

      {!loading && (
        <Row className="mt-4" xs={1} md={2} lg={3}>
          {properties.map(item => (
            <Col key={item.id} className="mb-4">
              <Card className="shadow-sm h-100">

                {item.image ? (
                  <Card.Img
                    variant="top"
                    src={
                      item.image.startsWith("http")
                        ? item.image
                        : `http://127.0.0.1:8000${item.image}`
                    }
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ height: "200px", backgroundColor: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    No Image
                  </div>
                )}

                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">₹{item.price_per_month}/month</Card.Subtitle>

                  <Card.Text>
                    <strong>Status:</strong>{" "}
                    <span className={item.status === 'AVAILABLE' ? "text-success fw-bold" : "text-danger fw-bold"}>
                      {item.status}
                    </span>
                    <br />
                    <strong>Location:</strong> {item.address}
                    <br />
                    <small>{(item.description || "").substring(0, 100)}...</small>
                  </Card.Text>

                  <div className="d-flex gap-2 mt-auto">
                    {/* ADMIN ACTIONS */}
                    {user && user.role === 'ADMIN' && (
                      <>
                        <Button variant="warning" size="sm" onClick={() => navigate(`/edit-property/${item.id}`)}>Edit</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
                      </>
                    )}

                    {/* USER ACTIONS */}
                    {user && user.role === 'USER' && item.status === 'AVAILABLE' && (
                      <>
                        <Button variant="success" size="sm" onClick={() => handleBookClick(item)}>Book Now</Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleFavorite(item.id)}>❤️</Button>
                      </>
                    )}

                    {/* GUEST ACTIONS */}
                    {!user && (
                      <Button variant="primary" size="sm" onClick={() => navigate('/login')}>Login to Book</Button>
                    )}
                  </div>

                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book: {selectedProperty?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingError && <Alert variant="danger">{bookingError}</Alert>}
          {bookingSuccess && <Alert variant="success">{bookingSuccess}</Alert>}
          <Form onSubmit={handleBookingSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">Confirm Booking Request</Button>
          </Form>
        </Modal.Body>
      </Modal>

    </div>
  );
}
