import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SupervisorMilestone.css";

const SupervisorMilestone = () => {
    // eslint-disable-next-line no-unused-vars
    const [milestones, setMilestones] = useState([]);
    const [groupedMilestones, setGroupedMilestones] = useState({});
    const [error, setError] = useState("");
    const [expandedGroup, setExpandedGroup] = useState(null);
    const [editing, setEditing] = useState(null);
    const [updatedFields, setUpdatedFields] = useState({});

    useEffect(() => {
        const fetchMilestones = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const headers = { Authorization: `Token ${token}` };
                const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
                const res = await axios.get(`${BASE_URL}/api/milestones/`, { headers });

                // Group milestones by student or group name
                const grouped = res.data.reduce((acc, milestone) => {
                    const key = milestone.student_name; // or group name if available
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(milestone);
                    return acc;
                }, {});
                setGroupedMilestones(grouped);
                setMilestones(res.data);
            } catch (err) {
                setError("Failed to fetch milestones.");
                console.error(err);
            }
        };
        fetchMilestones();
    }, []);

    const handleEdit = (milestone) => {
        setEditing(milestone.id);
        setUpdatedFields({
            status: milestone.status,
            remarks: milestone.remarks || "",
            completion_date: milestone.completion_date || "",
        });
    };

    const handleUpdate = async (milestoneId) => {
        try {
            const token = localStorage.getItem("authToken");
            const headers = {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            };

            const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
            await axios.put(`${BASE_URL}/api/milestones/${milestoneId}/`, updatedFields, { headers });

            const res = await axios.get(`${BASE_URL}/api/milestones/`, { headers });
            setMilestones(res.data);

            const grouped = res.data.reduce((acc, milestone) => {
                const key = milestone.student_name;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(milestone);
                return acc;
            }, {});
            setGroupedMilestones(grouped);

            setEditing(null);
        } catch (err) {
            setError("Failed to update milestone.");
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setUpdatedFields({
            ...updatedFields,
            [e.target.name]: e.target.value,
        });
    };

    const toggleGroup = (group) => {
        setExpandedGroup(expandedGroup === group ? null : group);
    };

    return (
        <div className="supervisor-dashboard">
            <h2>Supervisor Milestone Dashboard</h2>
            {error && <p className="error">{error}</p>}

            {Object.keys(groupedMilestones).length === 0 ? (
                <p>No milestones found.</p>
            ) : (
                <div className="grouped-milestones">
                    {Object.entries(groupedMilestones).map(([group, milestones]) => (
                        <div key={group} className="milestone-group">
                            <h3
                                className="group-title"
                                onClick={() => toggleGroup(group)}
                            >
                                {group}{" "}
                                <span>
                                    {expandedGroup === group ? "▼" : "►"}
                                </span>
                            </h3>
                            {expandedGroup === group && (
                                <table className="milestone-table">
                                    <thead>
                                        <tr>
                                            <th>Stage</th>
                                            <th>Milestone</th>
                                            <th>Status</th>
                                            <th>Completion Date</th>
                                            <th>Remarks</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {milestones.map((ms) => (
                                            <tr key={ms.id}>
                                                <td>{ms.stage_name}</td>
                                                <td>{ms.milestone}</td>
                                                {editing === ms.id ? (
                                                    <>
                                                        <td>
                                                            <select
                                                                name="status"
                                                                value={
                                                                    updatedFields.status
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                            >
                                                                <option value="Pending">
                                                                    Pending
                                                                </option>
                                                                <option value="In Progress">
                                                                    In Progress
                                                                </option>
                                                                <option value="Completed">
                                                                    Completed
                                                                </option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="date"
                                                                name="completion_date"
                                                                value={
                                                                    updatedFields.completion_date ||
                                                                    ""
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name="remarks"
                                                                value={
                                                                    updatedFields.remarks
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="btn save"
                                                                onClick={() =>
                                                                    handleUpdate(
                                                                        ms.id
                                                                    )
                                                                }
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                className="btn cancel"
                                                                onClick={() =>
                                                                    setEditing(
                                                                        null
                                                                    )
                                                                }
                                                            >
                                                                Cancel
                                                            </button>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td>{ms.status}</td>
                                                        <td>
                                                            {ms.completion_date ||
                                                                "N/A"}
                                                        </td>
                                                        <td>
                                                            {ms.remarks ||
                                                                "None"}
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="btn edit"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        ms
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </button>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SupervisorMilestone;
