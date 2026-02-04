import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { Table, Button, Badge, Modal, Form } from "react-bootstrap";

export default function Properties() {
    const [properties, setProperties] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: "", description: "", price_per_month: "", status: "AVAILABLE",
        owner_name: "", owner_contact: "", address: "", image: null
    });

    useEffect(() => { fetchProperties(); }, []);

    const fetchProperties = () => {
        axios.get("/admin/properties/").then(res => {
            console.log("Fetched properties:", res.data);
            setProperties(res.data);
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete property?")) {
            axios.delete(`/admin/properties/${id}/`).then(() => fetchProperties());
        }
    };

    const handleView = (property) => {
        setSelectedProperty(property);
        setShowViewModal(true);
    };

    const handleEdit = (property) => {
        setFormData({
            title: property.title || "",
            description: property.description || "",
            price_per_month: property.price_per_month || "",
            status: property.status || "AVAILABLE",
            owner_name: property.owner_name || "",
            owner_contact: property.owner_contact || "",
            address: property.address || "",
            image: null // Keep image null unless changed
        });
        setSelectedProperty(property);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleAdd = () => {
        setFormData({
            title: "", description: "", price_per_month: "", status: "AVAILABLE",
            owner_name: "", owner_contact: "", address: "", image: null
        });
        setIsEditing(false);
        setSelectedProperty(null);
        setShowModal(true);
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

        const request = isEditing
            ? axios.put(`/admin/properties/${selectedProperty.id}/`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
            : axios.post("/admin/properties/", form, { headers: { 'Content-Type': 'multipart/form-data' } });

        request
            .then(() => {
                setShowModal(false);
                fetchProperties();
                handleAdd(); // Reset form
            })
            .catch(err => {
                console.error("Error saving property:", err);
                alert("Failed to save property.");
            });
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Properties</h2>
                <Button variant="primary" onClick={handleAdd}>+ Add Property</Button>
            </div>

            <Table striped hover responsive className="bg-white shadow-sm rounded">
                <thead className="bg-light">
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
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
                            <td>₹{p.price_per_month}</td>
                            <td><Badge bg={p.status === 'AVAILABLE' ? 'success' : 'secondary'}>{p.status}</Badge></td>
                            <td>
                                <Button size="sm" variant="info" className="text-white" onClick={() => handleView(p)}>View Details</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Add/Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton><Modal.Title>{isEditing ? "Edit Property" : "Add Property"}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-2"><Form.Label>Title</Form.Label><Form.Control name="title" value={formData.title} onChange={handleInputChange} required /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Price</Form.Label><Form.Control type="number" name="price_per_month" value={formData.price_per_month} onChange={handleInputChange} required /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Address</Form.Label><Form.Control name="address" value={formData.address} onChange={handleInputChange} required /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Description</Form.Label><Form.Control as="textarea" name="description" value={formData.description} onChange={handleInputChange} required /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Owner Name</Form.Label><Form.Control name="owner_name" value={formData.owner_name} onChange={handleInputChange} /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Owner Contact</Form.Label><Form.Control name="owner_contact" value={formData.owner_contact} onChange={handleInputChange} /></Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Status</Form.Label>
                            <Form.Select name="status" value={formData.status} onChange={handleInputChange}>
                                <option value="AVAILABLE">Available</option>
                                <option value="BOOKED">Booked</option>
                                <option value="SOLD">Sold</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Image</Form.Label><Form.Control type="file" onChange={handleFileChange} /></Form.Group>
                        <Button type="submit" className="w-100 mt-3" variant="success">{isEditing ? "Update Property" : "Save Property"}</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* View Modal */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
                <Modal.Header closeButton><Modal.Title>Property Details</Modal.Title></Modal.Header>
                <Modal.Body>
                    {selectedProperty && (
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6">
                                    <img
                                        src={selectedProperty.image || "https://placehold.co/600x400?text=No+Image"}
                                        alt={selectedProperty.title}
                                        className="img-fluid rounded mb-3"
                                        style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <h4>{selectedProperty.title}</h4>
                                    <p className="text-muted">📍 {selectedProperty.address}</p>
                                    <h5 className="text-primary">₹{selectedProperty.price_per_month} / month</h5>
                                    <Badge bg={selectedProperty.status === 'AVAILABLE' ? 'success' : 'secondary'} className="mb-3">{selectedProperty.status}</Badge>

                                    <h6 className="mt-3">Description</h6>
                                    <p>{selectedProperty.description}</p>

                                    <hr />
                                    <h6>Owner Details</h6>
                                    <p><strong>Name:</strong> {selectedProperty.owner_name}</p>
                                    <p><strong>Contact:</strong> {selectedProperty.owner_contact}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {selectedProperty && (
                        <>
                            <Button variant="warning" className="text-white" onClick={() => { setShowViewModal(false); handleEdit(selectedProperty); }}>Edit</Button>
                            <Button variant="danger" onClick={() => { setShowViewModal(false); handleDelete(selectedProperty.id); }}>Delete</Button>
                        </>
                    )}
                    <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
