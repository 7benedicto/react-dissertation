import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentList.css";
import { useNavigate } from "react-router-dom";

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const loadStudents = async () => {
            if (!token) {
                setError("No authentication token found. Please log in.");
                return;
            }

            try {
                const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
                const response = await axios.get(`${BASE_URL}/api/students/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setStudents(response.data);
            } catch (err) {
                console.error("Error fetching students:", err);
                if (err.response?.status === 403) {
                    setError("❌ Unauthorized access. Admins only.");
                } else {
                    setError("❌ Failed to fetch students. Please try again.");
                }
            }
        };

        loadStudents();
    }, [token]);

    return (
        <div className="student-list-container">
            <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
            <h2>Registered Students</h2>

            {error && <p className="error-message">{error}</p>}

            {students.length > 0 ? (
                <table className="student-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Registration Number</th>
                            <th>Full Name</th>
                            <th>Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={student.id}>
                                <td>{index + 1}</td>
                                <td>{student.reg_number}</td>
                                <td>{student.full_name}</td>
                                <td>{student.project_title || "Not Assigned"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !error && <p>No students registered yet.</p>
            )}
        </div>
    );
};

export default StudentList;
