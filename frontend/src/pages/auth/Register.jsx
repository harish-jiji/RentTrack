import { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await axios.post("/auth/register/", {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName
            });

            navigate("/login");
        } catch (err) {
            const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : "Something went wrong. Please try again.";
            setError(errorMsg);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <Card style={{ width: "500px" }} className="p-4 shadow-sm">
                <h2 className="text-center mb-4">Register</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <div className="d-flex gap-3">
                        <Form.Group className="mb-3 w-50">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 w-50">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Button variant="success" type="submit" className="w-100">
                        Register
                    </Button>
                </Form>
                <div className="mt-3 text-center">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </Card>
        </Container>
    );
};

export default Register;
