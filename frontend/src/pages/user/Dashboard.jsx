import React, { useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const UserDashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <Container className="mt-5">
            <h2 className="mb-4">Welcome, {user?.username}!</h2>
            <p className="lead text-muted">Manage your account and bookings from here.</p>

            <Row className="mt-4">
                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm text-center p-3">
                        <Card.Body>
                            <Card.Title>🏠 Browse Properties</Card.Title>
                            <Card.Text>
                                Explore available properties and find your next home.
                            </Card.Text>
                            <Button as={Link} to="/properties" variant="primary">
                                View Properties
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm text-center p-3">
                        <Card.Body>
                            <Card.Title>📅 My Bookings</Card.Title>
                            <Card.Text>
                                View your past and upcoming booking requests.
                            </Card.Text>
                            <Button as={Link} to="/user/bookings" variant="secondary">
                                View Bookings
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm text-center p-3">
                        <Card.Body>
                            <Card.Title>❤️ My Favorites</Card.Title>
                            <Card.Text>
                                See the properties you have saved for later.
                            </Card.Text>
                            <Button as={Link} to="/user/favorites" variant="danger">
                                View Favorites
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm text-center p-3">
                        <Card.Body>
                            <Card.Title>👤 My Profile</Card.Title>
                            <Card.Text>
                                Update your personal details and account settings.
                            </Card.Text>
                            <Button as={Link} to="/user/profile" variant="info">
                                Edit Profile
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserDashboard;
