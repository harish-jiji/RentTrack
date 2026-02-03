import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Spinner, Alert } from "react-bootstrap";
import axios from "../../utils/axios";
import AuthContext from "../../context/AuthContext";

function PropertyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        axios
            .get(`properties/${id}/`)
            .then((res) => {
                setProperty(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load property details.");
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error || !property) {
        return (
            <Container className="text-center mt-5">
                <Alert variant="danger">{error || "Property not found"}</Alert>
                <Button variant="secondary" onClick={() => navigate('/properties')}>Back to Properties</Button>
            </Container>
        );
    }

    const handleBook = () => {
        if (!user) {
            navigate("/login");
        } else {
            navigate(`/book-property/${property.id}`);
        }
    };

    return (
        <Container className="mt-4">
            <Button variant="outline-secondary" className="mb-3" onClick={() => navigate('/properties')}>&larr; Back</Button>

            <div className="card shadow-sm p-3 mb-5 bg-white rounded">
                <img
                    src={property.image || "https://placehold.co/800x400?text=No+Image"}
                    onError={(e) => (e.target.src = "https://placehold.co/800x400?text=No+Image")}
                    alt={property.title}
                    className="img-fluid mb-4 rounded"
                    style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                />

                <h2>{property.title}</h2>
                <p className="text-muted">📍 {property.address}</p>
                <h4 className="text-primary">₹{property.price_per_month} / month</h4>

                <hr />
                <h5>Description</h5>
                <p>{property.description}</p>

                <div className="mt-4">
                    {user?.role === "USER" && (
                        <Button variant="success" size="lg" onClick={handleBook}>
                            Book Property
                        </Button>
                    )}

                    {!user && (
                        <Button variant="warning" size="lg" onClick={handleBook}>
                            Login to Book
                        </Button>
                    )}
                    {/* Admin view - maybe show edit button later? */}
                </div>
            </div>
        </Container>
    );
}

export default PropertyDetails;
