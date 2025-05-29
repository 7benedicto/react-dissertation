import React, { useState } from "react";
import axios from "axios";
import "./ConsultationSchedule.css"; // ✅ Add this line

const ConsultationSchedule = () => {
    const [topic, setTopic] = useState("");
    const [proposedDate, setProposedDate] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const regNumber = localStorage.getItem("regNumber");
        if (!regNumber) {
            setMessage("Registration number is missing. Please log in again.");
            return;
        }

        try {
            await axios.post("http://127.0.0.1:8000/api/book-consultation/",
                {
                    topic,
                    proposed_date: proposedDate,
                },
                {
                    params: { reg_number: regNumber },
                    headers: {
                        Authorization: `Token ${localStorage.getItem("authToken")}`,
                    },
                }
            );
            setMessage("Consultation booked successfully!");
            setTopic("");
            setProposedDate("");
        } catch (err) {
            console.error("Failed to book consultation", err);
            setMessage("Failed to book consultation. Please try again.");
        }
    };

    return (
        <div className="consultation-container">
            <h2>Book a Consultation</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Topic:</label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Proposed Date:</label>
                    <input
                        type="datetime-local"
                        value={proposedDate}
                        onChange={(e) => setProposedDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Book Consultation</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ConsultationSchedule;
