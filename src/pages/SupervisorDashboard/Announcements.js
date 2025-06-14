import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Announcements.css";

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
                const response = await axios.get(`${BASE_URL}/api/announcements/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setAnnouncements(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch announcements.");
            }
        };

        if (token) {
            fetchAnnouncements();
        } else {
            setError("No authentication token found. Please log in.");
        }
    }, [token]);

    const handlePost = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!token) {
            setError("No authentication token found. Please log in.");
            return;
        }

        try {
            const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
            const response = await axios.post(
                `${BASE_URL}/api/announcements/`,
                { title, content },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            setAnnouncements((prev) => [response.data, ...prev]);
            setTitle("");
            setContent("");
            setMessage("✅ Announcement posted successfully!");
        } catch (err) {
            console.error(err);
            setError("❌ Failed to post announcement.");
        }
    };

    return (
        <div className="announcement-container">
            <h2>Supervisor Announcements</h2>

            <form onSubmit={handlePost} className="announcement-form">
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Enter announcement title"
                    />
                </div>
                <div>
                    <label>Content:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows="4"
                        placeholder="Write your announcement..."
                    />
                </div>
                <button type="submit">Post Announcement</button>
            </form>

            {message && <p className="announcement-message">{message}</p>}
            {error && <p className="announcement-error">{error}</p>}

            <h3>Previous Announcements</h3>
            {announcements.length > 0 ? (
                <ul className="announcement-list">
                    {announcements.map((a) => (
                        <li key={a.id} className="announcement-item">
                            <h4>{a.title}</h4>
                            <p>{a.content}</p>
                            <small>Posted on {new Date(a.created_at).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No announcements yet.</p>
            )}
        </div>
    );
};

export default Announcements;
