import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateMilestone.css";

const CreateMilestone = () => {
    const [isGroup, setIsGroup] = useState(false);
    const [students, setStudents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [stages, setStages] = useState([]);
    const [selectedGroupOrStudent, setSelectedGroupOrStudent] = useState("");
    const [selectedStage, setSelectedStage] = useState("");
    const [milestoneDescription, setMilestoneDescription] = useState("");
    const [status, setStatus] = useState("Pending");
    const [completionDate, setCompletionDate] = useState("");
    const [remarks, setRemarks] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("authToken");

    useEffect(() => {
        // Fetch students
        const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
        axios
            .get(`${BASE_URL}/api/assigned-students/`, {
                headers: { Authorization: `Token ${token}` },
            })
            .then((res) => setStudents(res.data))
            .catch((err) => {
                console.error("Error fetching students", err);
                setError("Failed to fetch students.");
            });

        // Fetch groups
        axios
            .get(`${BASE_URL}/api/assigned-groups/`, {
                headers: { Authorization: `Token ${token}` },
            })
            .then((res) => setGroups(res.data))
            .catch((err) => {
                console.error("Error fetching groups", err);
                setError("Failed to fetch groups.");
            });

        // Fetch stages
        axios
            .get(`${BASE_URL}/api/stages/`, {
                headers: { Authorization: `Token ${token}` },
            })
            .then((res) => setStages(res.data))
            .catch((err) => {
                console.error("Error fetching stages", err);
                setError("Failed to fetch stages.");
            });
    }, [token]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!selectedGroupOrStudent || !selectedStage || !milestoneDescription) {
            setError("Please fill in all required fields.");
            return;
        }

        const data = {
            [isGroup ? "group" : "student"]: selectedGroupOrStudent,
            milestone: milestoneDescription,
            stage: selectedStage,
            status,
            completion_date: completionDate || null,
            remarks,
        };

        const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
        axios
            .post(`${BASE_URL}/api/milestones/`, data, {
                headers: { Authorization: `Token ${token}` },
            })
            .then(() => {
                setSelectedGroupOrStudent("");
                setSelectedStage("");
                setMilestoneDescription("");
                setStatus("Pending");
                setCompletionDate("");
                setRemarks("");
                setError("");
                alert("Milestone created successfully.");
            })
            .catch((err) => {
                console.error("Error creating milestone", err);
                setError("Failed to create milestone. Please try again.");
            });
    };

    return (
        <div className="milestone-form-container">
            <h2>Create Milestone</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}

                <div>
                    <label>
                        Assign to:
                        <select
                            value={isGroup ? "group" : "student"}
                            onChange={(e) => setIsGroup(e.target.value === "group")}
                        >
                            <option value="student">Individual Student</option>
                            <option value="group">Group</option>
                        </select>
                    </label>
                </div>

                {isGroup ? (
                    <div>
                        <label>Select Group:</label>
                        <select
                            value={selectedGroupOrStudent}
                            onChange={(e) => setSelectedGroupOrStudent(e.target.value)}
                        >
                            <option value="">--Select a Group--</option>
                            {groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div>
                        <label>Select Student:</label>
                        <select
                            value={selectedGroupOrStudent}
                            onChange={(e) => setSelectedGroupOrStudent(e.target.value)}
                        >
                            <option value="">--Select a Student--</option>
                            {students.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.full_name} ({student.reg_number})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <label>Select Stage:</label>
                    <select
                        value={selectedStage}
                        onChange={(e) => setSelectedStage(e.target.value)}
                    >
                        <option value="">--Select a Stage--</option>
                        {stages.map((stage) => (
                            <option key={stage.id} value={stage.id}>
                                {stage.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Milestone Description:</label>
                    <input
                        type="text"
                        value={milestoneDescription}
                        onChange={(e) => setMilestoneDescription(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Status:</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div>
                    <label>Completion Date:</label>
                    <input
                        type="date"
                        value={completionDate}
                        onChange={(e) => setCompletionDate(e.target.value)}
                    />
                </div>

                <div>
                    <label>Remarks:</label>
                    <textarea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                    />
                </div>

                <button type="submit">Create Milestone</button>
            </form>
        </div>
    );
};

export default CreateMilestone;
