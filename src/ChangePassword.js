import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("authToken");

            const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
            await axios.post(
                `${BASE_URL}/api/change-password/`,
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            setMessage("✅ Password changed successfully.");
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            const errorMsg = error.response?.data?.error || "❌ Failed to change password.";
            setMessage(errorMsg);
        }
    };

    return (
        <div className="change-password-container">
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Current Password:</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Update Password</button>
            </form>
            {message && <p>{message}</p>}
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Back
            </button>
        </div>
    );
};

export default ChangePassword;
