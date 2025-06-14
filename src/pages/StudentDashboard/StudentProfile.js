import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./StudentProfile.css";


const StudentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                setError("Authentication token not found. Please log in.");
                return;
            }

            try {
                const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
                const response = await axios.get(`${BASE_URL}/api/student-profile/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setProfile(response.data);
            } catch (err) {
                console.error("Error fetching student profile:", err);
                setError("Failed to load student profile.");
            }
        };

        fetchProfile();
    }, [token]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!profile) return <p>Loading profile...</p>;

    return (
        <div className="profile-container">
            <h2>Student Profile</h2>
            <p><strong>Full Name:</strong> {profile.full_name}</p>
            <p><strong>Registration Number:</strong> {profile.reg_number}</p>
            <p><strong>Project Title:</strong> {profile.project_title}</p>
            <p>
                <strong>Supervisor:</strong>{" "}
                <span style={{ color: profile.supervisor === "Not Assigned" ? "red" : "black" }}>
                    {profile.supervisor}
                </span>
            </p>

            <Link to="/change-password" className="change-password-link">
                Change Password
            </Link>
        </div>
    );
};

export default StudentProfile;
