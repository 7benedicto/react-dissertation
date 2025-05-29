import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FeedbackSection.css"; // Make sure to create and import this CSS file

const GiveFeedback = () => {
    const [students, setStudents] = useState([]);
    const [selectedRegNumber, setSelectedRegNumber] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setError("No authentication token found. Please log in again.");
                return;
            }

            try {
                const response = await axios.get("http://127.0.0.1:8000/api/assigned-students/", {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setStudents(response.data);
            } catch (err) {
                console.error("Error fetching students:", err);
                setError("Failed to fetch students.");
            }
        };

        fetchStudents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("No authentication token found. Please log in again.");
            return;
        }

        if (!selectedRegNumber) {
            setError("Please select a valid student.");
            return;
        }

        try {
            await axios.post(
                "http://127.0.0.1:8000/api/give-feedback/",
                {
                    reg_number: selectedRegNumber,
                    content,
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            setMessage("✅ Feedback sent successfully!");
            setContent("");
            setSelectedRegNumber("");
        } catch (err) {
            console.error("Error sending feedback:", err);
            setError("❌ Failed to send feedback. Please try again.");
        }
    };

    return (
        <div className="feedback-container">
            <h2>Give Feedback</h2>

            {error && <p className="feedback-error">{error}</p>}
            {message && <p className="feedback-success">{message}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Student:</label>
                    <select
                        value={selectedRegNumber}
                        onChange={(e) => setSelectedRegNumber(e.target.value)}
                        required
                    >
                        <option value="">Select a student</option>
                        {students.map((student) => (
                            <option key={student.reg_number} value={student.reg_number}>
                                {student.full_name} ({student.reg_number})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Feedback:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="5"
                        required
                    />
                </div>

                <button type="submit" className="submit-btn">Send Feedback</button>
            </form>
        </div>
    );
};

export default GiveFeedback;
