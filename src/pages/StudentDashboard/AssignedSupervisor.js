import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AssignedSupervisor.css"; // ✅ Import your CSS

const AssignedSupervisor = () => {
    const [supervisor, setSupervisor] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignedSupervisor = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication token not found. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
                const response = await axios.get(`${BASE_URL}/api/assigned-supervisor/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setSupervisor(response.data);
            } catch (err) {
                setError("Failed to fetch assigned supervisor.");
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedSupervisor();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="assigned-supervisor-container">
            <h2>Assigned Supervisor</h2>
            {error && <p className="error-message">{error}</p>}
            {supervisor ? (
                <div className="supervisor-card">
                    <p><strong>Name:</strong> {supervisor.username}</p>
                    <p><strong>Email:</strong> {supervisor.email}</p>
                </div>
            ) : (
                <p>No supervisor assigned yet.</p>
            )}
        </div>
    );
};

export default AssignedSupervisor;
