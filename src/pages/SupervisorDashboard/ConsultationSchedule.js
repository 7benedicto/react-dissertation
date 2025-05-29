import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ConsultationSchedule.css";

const ConsultationSchedule = () => {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchConsultations = async () => {
            setLoading(true);
            setError("");

            const email = localStorage.getItem("userEmail");
            const token = localStorage.getItem("authToken");

            if (!email || !token) {
                setError("No email or authentication token found. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get("http://127.0.0.1:8000/api/manage-consultation/", {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                    params: { email },
                });
                setConsultations(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch consultations.");
            } finally {
                setLoading(false);
            }
        };

        fetchConsultations();
    }, []);

    const handleUpdate = async (id, newStatus) => {
        setError("");
        const email = localStorage.getItem("userEmail");
        const token = localStorage.getItem("authToken");

        if (!email || !token) {
            setError("No email or authentication token found. Please log in again.");
            return;
        }

        try {
            await axios.patch(
                `http://127.0.0.1:8000/api/manage-consultation/${id}/`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                    params: { email },
                }
            );
            setConsultations((prev) =>
                prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
            );
        } catch (err) {
            console.error(err);
            setError("Failed to update consultation.");
        }
    };

    return (
        <div className="consultation-container">
            <h2>Manage Consultations</h2>
            {error && <p className="error-text">{error}</p>}
            {loading ? (
                <p className="loading-text">Loading consultations...</p>
            ) : (
                <table className="consultation-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Topic</th>
                            <th>Proposed Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {consultations.map((c) => (
                            <tr key={c.id}>
                                <td>{c.student_name}</td>
                                <td>{c.topic}</td>
                                <td>{new Date(c.proposed_date).toLocaleString()}</td>
                                <td>{c.status}</td>
                                <td>
                                    {c.status === "Pending" ? (
                                        <>
                                            <button onClick={() => handleUpdate(c.id, "Approved")}>
                                                Approve
                                            </button>
                                            <button onClick={() => handleUpdate(c.id, "Rejected")}>
                                                Reject
                                            </button>
                                        </>
                                    ) : (
                                        <em>No actions</em>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ConsultationSchedule;
