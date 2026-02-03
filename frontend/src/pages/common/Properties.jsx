import { useEffect, useState } from "react";
import { Card, Button, Row, Col, Spinner, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "../../utils/axios";

function Properties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        axios
            .get("properties/")
            .then((res) => {
                setProperties(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load properties");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">Loading properties...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center mt-5">
                <p className="text-danger">{error}</p>
            </Container>
        );
    }

    if (properties.length === 0) {
        return (
            <Container className="text-center mt-5">
                <p>No properties available at the moment.</p>
            </Container>
        );
    }

    return (
        <Container>
            <h2 className="my-4 text-center">Available Properties</h2>
            <Row>
                {properties.map((prop) => (
                    <Col md={4} key={prop.id} className="mb-4">
                        <Card className="h-100 shadow-sm">
                            <Card.Img
                                variant="top"
                                src={prop.image || "https://placehold.co/600x400?text=No+Image"}
                                onError={(e) => (e.target.src = "https://placehold.co/600x400?text=No+Image")}
                                style={{ height: "200px", objectFit: "cover" }}
                            />
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>{prop.title}</Card.Title>
                                <Card.Text>
                                    📍 {prop.address} <br />
                                    💰 ₹{prop.price_per_month} / month
                                </Card.Text>

                                <Button
                                    as={Link}
                                    to={`/properties/${prop.id}`}
                                    variant="primary"
                                    className="w-100 mt-auto"
                                >
                                    View Details
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Properties;
