import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Announcements.css"; // ✅ Import styles

const StudentAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("No token found. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
                const response = await axios.post(`${BASE_URL}/api/student-announcements/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setAnnouncements(response.data);
            } catch (err) {
                console.error("Error fetching announcements:", err);
                setError("Failed to fetch announcements.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    return (
        <div className="announcements-container">
            <h2>Announcements</h2>
            {loading ? (
                <p className="loading-message">Loading...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : announcements.length === 0 ? (
                <p>No announcements found.</p>
            ) : (
                <ul className="announcement-list">
                    {announcements.map((a) => (
                        <li className="announcement-item" key={a.id}>
                            <h4>{a.title}</h4>
                            <p>{a.content}</p>
                            <small>Posted on {new Date(a.created_at).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default StudentAnnouncements;
