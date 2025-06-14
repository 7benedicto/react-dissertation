import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import "./styles.css";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
                const response = await axios.get(`${BASE_URL}/api/user-profile/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setUser(response.data);
            } catch (err) {
                setError("Unable to load user profile.");
            }
        };

        fetchProfile();
    }, [token]);

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {user ? (
                <div className="profile-details">
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>

                    <Link to="/change-password" className="change-password-link">
                        Change Password
                    </Link>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserProfile;
