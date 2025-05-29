import React, { useEffect, useState } from "react";
import axios from "axios";

const ProgressTracker = () => {
    const [progress, setProgress] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editRemarks, setEditRemarks] = useState({}); // { milestoneId: "remarks" }

    useEffect(() => {
        const fetchUserAndMilestones = async () => {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            };

            if (!token) {
                setError("Please log in to view progress.");
                setLoading(false);
                return;
            }

            try {
                const profileResponse = await axios.get("/api/user-profile/", { headers });
                setUserRole(profileResponse.data.role);

                const milestoneResponse = await axios.get("/api/milestones/", { headers });
                setProgress(milestoneResponse.data);
                setError("");
            } catch (err) {
                console.error("Error fetching data:", err);
                if (err.response?.status === 403) {
                    setError("You are not authorized to view this data.");
                } else if (err.response?.status === 401) {
                    setError("Authentication required. Please log in.");
                } else {
                    setError("Error fetching progress.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndMilestones();
    }, []);

    const handleEditChange = (id, value) => {
        setEditRemarks((prev) => ({ ...prev, [id]: value }));
    };

    const handleUpdate = async (milestoneId) => {
        const token = localStorage.getItem("token");
        const headers = {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        };

        const updatedData = {
            remarks: editRemarks[milestoneId] || "", // Use the edited value
        };

        try {
            await axios.put(`/api/milestones/${milestoneId}/`, updatedData, { headers });
            alert("Milestone updated successfully.");
            // Refresh data after update
            setLoading(true);
            const milestoneResponse = await axios.get("/api/milestones/", { headers });
            setProgress(milestoneResponse.data);
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update milestone.");
        }
    };

    return (
        <div>
            <h2>Progress Tracker</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <>
                    {userRole === "Supervisor" && (
                        <div>
                            <h3>Supervisor View</h3>
                            <p>You can edit milestones for your students below.</p>
                        </div>
                    )}

                    {progress.length > 0 ? (
                        <ul>
                            {progress.map((milestone) => (
                                <li key={milestone.id} style={{ marginBottom: "20px" }}>
                                    <strong>{milestone.milestone}</strong> - {milestone.status}
                                    <br />
                                    Stage: {milestone.stage_name}
                                    <br />
                                    Student: {milestone.student_name}
                                    <br />
                                    Completion Date: {milestone.completion_date || "Not set"}
                                    <br />
                                    Remarks:{" "}
                                    {userRole === "Supervisor" ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editRemarks[milestone.id] || milestone.remarks || ""}
                                                onChange={(e) =>
                                                    handleEditChange(milestone.id, e.target.value)
                                                }
                                                style={{ marginRight: "10px" }}
                                            />
                                            <button onClick={() => handleUpdate(milestone.id)}>
                                                Save
                                            </button>
                                        </>
                                    ) : (
                                        milestone.remarks || "None"
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No progress milestones found.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default ProgressTracker;
