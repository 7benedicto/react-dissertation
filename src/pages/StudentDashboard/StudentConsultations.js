import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentConsultation.css";

const StudentConsultationStatus = () => {
    const [consultations, setConsultations] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConsultations = async () => {
            try {
                const regNumber = localStorage.getItem("regNumber");
                const token = localStorage.getItem("token");

                if (!regNumber) {
                    setError("No registration number found. Please log in again.");
                    setLoading(false);
                    return;
                }

                if (!token) {
                    setError("No token found. Please log in.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get("http://127.0.0.1:8000/api/student-consultations/", {
                    params: { regNumber },
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });

                setConsultations(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch your consultations.");
            } finally {
                setLoading(false);
            }
        };

        fetchConsultations();
    }, []);

    return (
        <div className="consultation-container">
            <h2>Your Consultation Requests</h2>
            {loading ? (
                <p className="consultation-message">Loading...</p>
            ) : error ? (
                <p className="consultation-error">{error}</p>
            ) : consultations.length === 0 ? (
                <p className="consultation-message">No consultations found.</p>
            ) : (
                <table className="consultation-table">
                    <thead>
                        <tr>
                            <th>Topic</th>
                            <th>Proposed Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {consultations.map((c) => (
                            <tr key={c.id}>
                                <td>{c.topic}</td>
                                <td>{new Date(c.proposed_date).toLocaleString()}</td>
                                <td>{c.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StudentConsultationStatus;
