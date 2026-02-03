import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { Table, Button, Form, Modal, Badge } from "react-bootstrap";

export default function Admins() {
    const [admins, setAdmins] = useState([]); // reused users endpoint filtering on frontend or backend
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = () => {
        axios.get("/admin/users/").then(res => {
            setUsers(res.data);
            setAdmins(res.data.filter(u => u.role === 'ADMIN'));
        });
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleCreate = (e) => {
        e.preventDefault();
        axios.post("/admin/create-admin/", formData)
            .then(() => {
                setShowModal(false);
                fetchUsers();
            })
            .catch(err => alert("Error: " + JSON.stringify(err.response.data)));
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Manage Admins</h2>
                <Button variant="dark" onClick={() => setShowModal(true)}>+ New Admin</Button>
            </div>

            <Table striped hover responsive className="bg-white shadow rounded">
                <thead className="bg-dark text-white">
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map(a => (
                        <tr key={a.id}>
                            <td>{a.id}</td>
                            <td>{a.username}</td>
                            <td>{a.email}</td>
                            <td><Badge bg="warning" text="dark">SUPER ADMIN</Badge></td>
                            <td><Badge bg="success">Active</Badge></td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton><Modal.Title>Create New Admin</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreate}>
                        <Form.Group className="mb-2">
                            <Form.Label>Username</Form.Label>
                            <Form.Control name="username" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" onChange={handleChange} required />
                        </Form.Group>
                        <Button type="submit" variant="dark" className="w-100">Create Admin</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
