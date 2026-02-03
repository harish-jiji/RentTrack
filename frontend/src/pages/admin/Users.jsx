import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { Table, Button, Badge } from "react-bootstrap";

export default function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = () => {
        axios.get("/admin/users/").then(res => setUsers(res.data));
    };

    const toggleBan = (id, isBanned) => {
        const action = isBanned ? 'unban' : 'ban';
        axios.put(`/admin/users/${id}/${action}/`).then(() => fetchUsers());
    };

    return (
        <div>
            <h2 className="fw-bold mb-4">User Management</h2>
            <Table striped hover responsive className="bg-white shadow-sm rounded">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.username}</td>
                            <td>{u.email}</td>
                            <td><Badge bg={u.role === 'ADMIN' ? 'dark' : 'primary'}>{u.role}</Badge></td>
                            <td>{u.is_banned ? <Badge bg="danger">Banned</Badge> : <Badge bg="success">Active</Badge>}</td>
                            <td>
                                {u.role !== 'ADMIN' && (
                                    <Button
                                        size="sm"
                                        variant={u.is_banned ? "warning" : "danger"}
                                        onClick={() => toggleBan(u.id, u.is_banned)}
                                    >
                                        {u.is_banned ? "Unban" : "Ban User"}
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
