import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Card, Button, Spinner, Container, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axios from "../../utils/axios";

const Favorites = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get("/favorites/");
                setFavorites(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching favorites:", error);
                setError("Failed to load your favorites.");
                setLoading(false);
            }
        };

        if (user) {
            fetchFavorites();
        }
    }, [user]);

    const removeFavorite = async (id) => {
        try {
            await axios.delete(`/favorites/${id}/`);
            setFavorites(prev => prev.filter(fav => fav.id !== id));
        } catch (err) {
            console.error("Failed to remove favorite", err);
            alert("Could not remove favorite. Please try again.");
        }
    };

    if (loading) return (
        <Container className="text-center mt-5">
            <Spinner animation="border" />
            <p className="mt-2">Loading favorites...</p>
        </Container>
    );

    if (error) return (
        <Container className="text-center mt-5">
            <Alert variant="danger">{error}</Alert>
        </Container>
    );

    return (
        <Container className="mt-4">
            <h2 className="mb-4">My Favorites</h2>
            {!favorites || favorites.length === 0 ? (
                <div className="text-center p-5 bg-light rounded">
                    <h4>No favorites yet</h4>
                    <p className="text-muted">Save properties you love to find them easily later.</p>
                    <Button as={Link} to="/properties" variant="primary">Browse Properties</Button>
                </div>
            ) : (
                <Row xs={1} md={3} className="g-4">
                    {favorites.map((fav) => (
                        <Col key={fav.id}>
                            <Card className="h-100 shadow-sm">
                                {fav.property_details && (
                                    <>
                                        <Card.Img
                                            variant="top"
                                            src={fav.property_details.image || "https://placehold.co/600x400?text=No+Image"}
                                            onError={(e) => (e.target.src = "https://placehold.co/600x400?text=No+Image")}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title>{fav.property_details.title}</Card.Title>
                                            <Card.Text>
                                                {fav.property_details.address}
                                                <br />
                                                <strong>₹{fav.property_details.price_per_month}/month</strong>
                                            </Card.Text>
                                            <div className="mt-auto d-flex justify-content-between">
                                                <Button
                                                    as={Link}
                                                    to={`/properties/${fav.property_details.id}`}
                                                    variant="primary"
                                                    size="sm"
                                                >
                                                    View Details
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => removeFavorite(fav.id)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </>
                                )}
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default Favorites;
