import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { Table, Button, Badge, Modal, Form } from "react-bootstrap";

export default function Properties() {
    const [properties, setProperties] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: "", description: "", price_per_month: "", status: "AVAILABLE",
        owner_name: "", owner_contact: "", address: "", image: null
    });

    useEffect(() => { fetchProperties(); }, []);

    const fetchProperties = () => {
        axios.get("/admin/properties/").then(res => setProperties(res.data));
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete property?")) {
            axios.delete(`/admin/properties/${id}/`).then(() => fetchProperties());
        }
    };

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setFormData({ ...formData, image: e.target.files[0] });

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = new FormData();
        Object.keys(formData).forEach(k => {
            if (k === 'image') {
                if (formData.image) form.append(k, formData.image);
            } else {
                form.append(k, formData[k]);
            }
        });

        axios.post("/admin/properties/", form).then(() => {
            setShowModal(false);
            fetchProperties();
            setFormData({
                title: "", description: "", price_per_month: "", status: "AVAILABLE",
                owner_name: "", owner_contact: "", address: "", image: null
            });
        });
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Properties</h2>
                <Button variant="primary" onClick={() => setShowModal(true)}>+ Add Property</Button>
            </div>

            <Table striped hover responsive className="bg-white shadow-sm rounded">
                <thead className="bg-light">
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Owner</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {properties.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.title}</td>
                            <td>{p.owner_name}</td>
                            <td>₹{p.price_per_month}</td>
                            <td><Badge bg={p.status === 'AVAILABLE' ? 'success' : 'secondary'}>{p.status}</Badge></td>
                            <td>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton><Modal.Title>Add Property</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-2"><Form.Label>Title</Form.Label><Form.Control name="title" onChange={handleInputChange} required /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Price</Form.Label><Form.Control type="number" name="price_per_month" onChange={handleInputChange} required /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Address</Form.Label><Form.Control name="address" onChange={handleInputChange} required /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Description</Form.Label><Form.Control as="textarea" name="description" onChange={handleInputChange} required /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Owner Name</Form.Label><Form.Control name="owner_name" onChange={handleInputChange} /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Owner Contact</Form.Label><Form.Control name="owner_contact" onChange={handleInputChange} /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Image</Form.Label><Form.Control type="file" onChange={handleFileChange} /></Form.Group>
                        <Button type="submit" className="w-100 mt-3" variant="success">Save Property</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
