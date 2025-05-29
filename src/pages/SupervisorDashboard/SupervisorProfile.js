import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Only if you're using routing
import "./styles.css";

const SupervisorProfile = () => {
    const [supervisor, setSupervisor] = useState(null);
    const [error, setError] = useState("");
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/supervisor-profile/", {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setSupervisor(response.data);
            } catch (err) {
                console.error("Profile fetch error:", err);
                setError("Failed to load supervisor profile.");
            }
        };

        fetchProfile();
    }, [token]);

    return (
        <div className="profile-container">
            <h2>Supervisor Profile</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {supervisor ? (
                <div className="profile-details">
                    <p><strong>Username:</strong> {supervisor.username}</p>
                    <p><strong>Email:</strong> {supervisor.email}</p>

                    {/* ✅ Change Password Link */}
                    <Link to="/change-password" className="change-password-link">
                        Change Password
                    </Link>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default SupervisorProfile;
