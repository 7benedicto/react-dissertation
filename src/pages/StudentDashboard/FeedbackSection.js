import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FeedbackSection.css"; // Import CSS

const ViewFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFeedback = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("You are not logged in.");
                return;
            }

            try {
                const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
                const response = await axios.get(`${BASE_URL}/api/view-feedback/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setFeedbacks(response.data);
            } catch (err) {
                console.error("Error fetching feedback:", err);
                setError("Failed to fetch feedback.");
            }
        };

        fetchFeedback();
    }, []);

    return (
        <div className="view-feedback-container">
            <h2>View Feedback</h2>
            {error && <p className="error-message">{error}</p>}
            <ul className="feedback-list">
                {feedbacks.map((feedback) => (
                    <li className="feedback-item" key={feedback.id}>
                        <p><strong>From:</strong> {feedback.supervisor_name}</p>
                        <p>{feedback.content}</p>
                        <small>Sent on {new Date(feedback.created_at).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewFeedback;
