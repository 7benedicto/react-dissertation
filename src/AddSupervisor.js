import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddSupervisor.css";

const AddSupervisor = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // 👈 for navigating back

    const token = localStorage.getItem("authToken");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
            const response = await axios.post(
                `${BASE_URL}/api/create-supervisor/`,
                { username, email, password },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            setMessage(response.data.message || "Supervisor created successfully!");
            setUsername("");
            setEmail("");
            setPassword("");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to create supervisor.");
        }
    };

    return (
        <div className="add-supervisor-container">
            <h2>Add New Supervisor</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Supervisor</button>
            </form>

            {message && <p className="message" style={{ color: "green" }}>{message}</p>}
            {error && <p className="message" style={{ color: "red" }}>{error}</p>}

            <button className="back-button" onClick={() => navigate(-1)}>
                ← Back
            </button>
        </div>
    );
};

export default AddSupervisor;
