import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AssignedSupervisor.css";

const AssignedSupervisor = () => {
    const [groupInfo, setGroupInfo] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroupSupervisor = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication token not found. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get("http://127.0.0.1:8000/api/assigned-group-supervisor/", {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setGroupInfo(response.data);
            } catch (err) {
                setError(err.response?.data?.error || "Failed to fetch group and supervisor information.");
            } finally {
                setLoading(false);
            }
        };

        fetchGroupSupervisor();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="assigned-supervisor-container">
            <h2>Assigned Supervisor</h2>
            {error && <p className="error-message">{error}</p>}
            {groupInfo ? (
                <div className="group-info-card">
                    <p><strong>Group Name:</strong> {groupInfo.group_name}</p>
                    <p><strong>Supervisor Name:</strong> {groupInfo.supervisor_username}</p>
                    <p><strong>Supervisor Email:</strong> {groupInfo.supervisor_email}</p>
                </div>
            ) : (
                <p>No group or supervisor assigned yet.</p>
            )}
        </div>
    );
};

export default AssignedSupervisor;
