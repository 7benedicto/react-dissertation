import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation
import "./AssignSupervisor.css";

const AssignSupervisor = () => {
    const [students, setStudents] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [selectedSupervisor, setSelectedSupervisor] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem("authToken");

    // Fetch students without groups and supervisors
    const fetchData = useCallback(async () => {
        if (!token) {
            setError("No authentication token found. Please log in.");
            return;
        }

        try {
            const studentResponse = await axios.get(
                "http://127.0.0.1:8000/api/students-without-groups/",
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );

            const supervisorResponse = await axios.get(
                "http://127.0.0.1:8000/api/supervisors/",
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );

            setStudents(studentResponse.data);
            setSupervisors(supervisorResponse.data);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch students or supervisors.");
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const assignSupervisor = async (force = false) => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/assign-supervisor/",
                {
                    reg_number: selectedStudent,
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
                    if (
                        window.confirm(
                            `${data.error} Do you want to reassign anyway?`
                        )
                    ) {
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
        assignSupervisor(false);
    };

    return (
        <div className="assign-supervisor-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <h2>Assign Supervisor to Student</h2>

            <form onSubmit={handleAssign}>
                <div>
                    <label>Student:</label>
                    <select
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        required
                    >
                        <option value="">Select a student</option>
                        {students.map((student) => (
                            <option
                                key={student.reg_number}
                                value={student.reg_number}
                            >
                                {student.full_name} ({student.reg_number})
                            </option>
                        ))}
                    </select>
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
                        <th>Student Name</th>
                        <th>Registration Number</th>
                        <th>Supervisor</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.reg_number}>
                            <td>{student.full_name}</td>
                            <td>{student.reg_number}</td>
                            <td>
                                {student.supervisor ? (
                                    student.supervisor.username
                                ) : (
                                    <span className="not-assigned">
                                        Not Assigned
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssignSupervisor;
