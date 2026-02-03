import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { Card, Form, Button } from "react-bootstrap";

export default function Profile() {
    const [profile, setProfile] = useState({});

    useEffect(() => {
        // Reusing the general profile endpoint but accessing via axios util
        axios.get("/auth/profile/").then(res => setProfile(res.data));
    }, []);

    return (
        <div className="d-flex justify-content-center">
            <Card className="shadow p-4" style={{ width: "500px" }}>
                <h3 className="text-center mb-4">Admin Profile</h3>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control value={profile.username || ''} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control value={profile.email || ''} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Control value={profile.role || ''} disabled />
                    </Form.Group>
                    <Button variant="dark" className="w-100">Update Password (Coming Soon)</Button>
                </Form>
            </Card>
        </div>
    );
}
