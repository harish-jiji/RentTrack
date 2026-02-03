import React, { useEffect, useState, useContext } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import AuthContext from "../../context/AuthContext";
import axios from "../../utils/axios";

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profileData, setProfileData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        address: ""
    });
    const [msg, setMsg] = useState("");
    const [variant, setVariant] = useState("info");
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const response = await axios.get("auth/profile/");
            setProfileData(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setMsg("Failed to load profile.");
            setVariant("danger");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        try {
            await axios.put("auth/profile/", {
                phone: profileData.phone,
                address: profileData.address
            });
            setMsg("Profile updated successfully!");
            setVariant("success");
            fetchProfile(); // Refresh to act confirmed
        } catch (err) {
            console.error(err);
            setMsg("Error updating profile.");
            setVariant("danger");
        }
    };

    if (loading) return (
        <Container className="text-center mt-5">
            <Spinner animation="border" />
            <p className="mt-2">Loading profile...</p>
        </Container>
    );

    return (
        <Container className="d-flex justify-content-center mt-5">
            <Card style={{ width: "600px" }} className="p-4 shadow">
                <h2 className="text-center mb-4">My Profile</h2>
                {msg && <Alert variant={variant} onClose={() => setMsg("")} dismissible>{msg}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" value={profileData.username || ""} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={profileData.email || ""} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" value={profileData.first_name || ""} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" value={profileData.last_name || ""} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="text"
                            value={profileData.phone || ""}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            placeholder="Enter your phone number"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={profileData.address || ""}
                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                            placeholder="Enter your address"
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">Update Profile</Button>
                </Form>
            </Card>
        </Container>
    );
};

export default Profile;
