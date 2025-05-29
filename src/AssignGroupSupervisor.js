import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AssignSupervisor.css";

const AssignGroupSupervisor = () => {
    const [projectGroups, setProjectGroups] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [selectedProjectGroups, setSelectedProjectGroups] = useState([]);
    const [selectedSupervisor, setSelectedSupervisor] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem("authToken");

    const fetchData = useCallback(async () => {
        if (!token) {
            setError("No authentication token found. Please log in.");
            return;
        }

        try {
            const projectGroupsResponse = await axios.get("http://127.0.0.1:8000/api/project-groups/", {
                headers: { Authorization: `Token ${token}` },
            });

            const supervisorResponse = await axios.get("http://127.0.0.1:8000/api/supervisors/", {
                headers: { Authorization: `Token ${token}` },
            });

            setProjectGroups(projectGroupsResponse.data);
            setSupervisors(supervisorResponse.data);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch groups or supervisors.");
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const assignSupervisor = async (force = false) => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/assign-group-supervisor/",
                {
                    group_ids: selectedProjectGroups,
                    supervisor_id: selectedSupervisor,
                    force: force,
                },
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );

            setMessage(response.data.message);
            setError("");
            fetchData();
        } catch (err) {
            console.error("Error assigning supervisor:", err);

            if (err.response) {
                const data = err.response.data;

                if (data.requires_confirmation) {
                    if (window.confirm(`${data.error} Do you want to reassign anyway?`)) {
                        assignSupervisor(true);
                        return;
                    } else {
                        setError("Assignment cancelled.");
                        return;
                    }
                }

                setError(data.error || "❌ Failed to assign supervisor.");
            } else {
                setError("❌ Network or server error.");
            }
        }
    };

    const handleAssign = (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (selectedProjectGroups.length === 0) {
            setError("Please select at least one group.");
            return;
        }

        if (!selectedSupervisor) {
            setError("Please select a supervisor.");
            return;
        }

        assignSupervisor(false);
    };

    return (
        <div className="assign-supervisor-container">
            <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

            <h2>Assign Supervisor to Group</h2>

            <form onSubmit={handleAssign}>
                <div>
                    <label>Groups:</label>
                    <select
                        multiple
                        value={selectedProjectGroups}
                        onChange={(e) => {
                            const options = Array.from(e.target.selectedOptions);
                            setSelectedProjectGroups(options.map((option) => option.value));
                        }}
                        required
                    >
                        {projectGroups.map((projectGroup) => (
                            <option key={projectGroup.group_id} value={projectGroup.group_id}>
                                {projectGroup.name} ({projectGroup.group_id})
                            </option>
                        ))}
                    </select>
                    <small>Hold down Ctrl (Windows) or Command (Mac) to select multiple groups.</small>
                </div>

                <div>
                    <label>Supervisor:</label>
                    <select
                        value={selectedSupervisor}
                        onChange={(e) => setSelectedSupervisor(e.target.value)}
                        required
                    >
                        <option value="">Select a supervisor</option>
                        {supervisors.map((supervisor) => (
                            <option key={supervisor.id} value={supervisor.id}>
                                {supervisor.username} ({supervisor.email})
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit">Assign Supervisor</button>
            </form>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <h3>Assigned Supervisors</h3>
            <table>
                <thead>
                    <tr>
                        <th>Group Name</th>
                        <th>Group ID</th>
                        <th>Supervisor</th>
                    </tr>
                </thead>
                <tbody>
                    {projectGroups.map((projectGroup) => (
                        <tr key={projectGroup.group_id}>
                            <td>{projectGroup.name}</td>
                            <td>{projectGroup.group_id}</td>
                            <td>
                                {projectGroup.supervisor ? projectGroup.supervisor.username : (
                                    <span className="not-assigned">Not Assigned</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssignGroupSupervisor;
