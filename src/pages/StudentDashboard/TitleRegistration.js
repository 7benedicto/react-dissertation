import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TitleRegistration.css";

const TitleRegistration = () => {
    const [projectTitle, setProjectTitle] = useState("");
    const [message, setMessage] = useState("");
    const [isGroupLeader, setIsGroupLeader] = useState(false);
    const [groupId, setGroupId] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            try {
                const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
                const response = await axios.get(`${BASE_URL}/api/student-profile/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                if (response.data.is_group_leader) {
                    setIsGroupLeader(true);
                    setGroupId(response.data.group_id);
                }
            } catch (error) {
                console.error("Failed to fetch profile info:", error);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
            const url = isGroupLeader
                ? `${BASE_URL}/api/register-group-title/`
                : `${BASE_URL}/api/register-title/`

            const payload = isGroupLeader
                ? { project_title: projectTitle, group_id: groupId }
                : { project_title: projectTitle };

            const response = await axios.post(url, payload, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            setMessage(response.data.message || "Project title registered!");
        } catch (err) {
            console.error("Registration error:", err);
            setMessage("Failed to register project title. Try again.");
        }
    };

    return (
        <div className="title-registration-container">
            <h2>{isGroupLeader ? "Register Group Project Title" : "Register Your Project Title"}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Project Title:</label>
                    <input
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default TitleRegistration;
