import { useState, useContext } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axios from "../../utils/axios";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("/auth/login/", { username, password });
            const { access } = response.data;

            // Fetch profile with new token
            // We need to bypass the interceptor for this specific call or manually set headers if the interceptor depends on localStorage which isn't updated yet.
            // Actually, we can manually set the header for this request since we have the token
            const profileResponse = await axios.get("/auth/profile/", {
                headers: { Authorization: `Bearer ${access}` }
            });

            login(access, profileResponse.data.role, profileResponse.data.username);

        } catch (err) {
            const errorMsg = err.response?.data?.detail || "Login failed";
            setError(errorMsg);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <Card style={{ width: "400px" }} className="p-4 shadow-sm">
                <h2 className="text-center mb-4">Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        Login
                    </Button>
                </Form>
                <div className="mt-3 text-center">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>
            </Card>
        </Container>
    );
};

export default Login;
