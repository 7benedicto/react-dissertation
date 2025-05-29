import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentProgress.css";

const StudentProgress = () => {
    const [milestones, setMilestones] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMilestones = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Token ${token}` };
                const res = await axios.get("/api/student/milestones/", { headers });
                setMilestones(res.data);
            } catch (err) {
                console.error("Error fetching student milestones", err);
                setError("Failed to load milestones.");
            }
        };

        fetchMilestones();
    }, []);

    const completedCount = milestones.filter(ms => ms.status === "Completed").length;
    const progressPercent = milestones.length > 0
        ? Math.round((completedCount / milestones.length) * 100)
        : 0;

    return (
        <div className="progress-container">
            <h2>My Project Progress</h2>
            {error && <p className="error-message">{error}</p>}

            {milestones.length > 0 && (
                <div className="progress-bar-wrapper">
                    <div className="progress-label">
                        Overall Progress: {progressPercent}%
                    </div>
                    <div className="progress-bar">
                        <div
                            className={`progress-bar-fill ${progressPercent === 100 ? "completed" : ""}`}
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {milestones.length === 0 ? (
                <p>No milestones available yet.</p>
            ) : (
                <table className="progress-table">
                    <thead>
                        <tr>
                            <th>Stage</th>
                            <th>Milestone</th>
                            <th>Status</th>
                            <th>Completion Date</th>
                            <th>Type</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {milestones.map((ms) => (
                            <tr key={ms.id}>
                                <td>{ms.stage_name}</td>
                                <td>{ms.milestone}</td>
                                <td>{ms.status}</td>
                                <td>{ms.completion_date || "N/A"}</td>
                                <td>{ms.group ? "Group" : "Individual"}</td>
                                <td>{ms.remarks || "None"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StudentProgress;
