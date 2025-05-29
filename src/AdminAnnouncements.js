import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminAnnouncements.css";
import { useNavigate } from "react-router-dom";

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [targetGroup, setTargetGroup] = useState("students");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchAnnouncements = async () => {
            if (!token) {
                setError("No authentication token found. Please log in.");
                return;
            }

            try {
                const response = await axios.get("http://127.0.0.1:8000/api/admin-announcements/", {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setAnnouncements(response.data);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 403) {
                    setError("❌ Unauthorized access. Admins only.");
                } else {
                    setError("❌ Failed to fetch announcements.");
                }
            }
        };

        fetchAnnouncements();
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
            const response = await axios.post(
                "http://127.0.0.1:8000/api/admin-announcements/",
                { title, content, target_group: targetGroup },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            setAnnouncements((prev) => [response.data, ...prev]);
            setTitle("");
            setContent("");
            setTargetGroup("students");
            setMessage("✅ Announcement posted successfully!");
        } catch (err) {
            console.error(err);
            setError("❌ Failed to post announcement.");
        }
    };

    return (
        <div className="announcement-container">
            <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

            <h2>Admin Announcements</h2>
            <form onSubmit={handlePost}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Content:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Target Group:</label>
                    <select
                        value={targetGroup}
                        onChange={(e) => setTargetGroup(e.target.value)}
                        required
                    >
                        <option value="students">Students</option>
                        <option value="supervisors">Supervisors</option>
                    </select>
                </div>
                <button type="submit">Post Announcement</button>
            </form>

            {message && <p className="message-success">{message}</p>}
            {error && <p className="message-error">{error}</p>}

            <h3>Previous Announcements</h3>
            <ul>
                {announcements.map((announcement) => (
                    <li key={announcement.id}>
                        <h4>{announcement.title}</h4>
                        <p>{announcement.content}</p>
                        <small>
                            Target Group: {announcement.target_group} | Posted on{" "}
                            {new Date(announcement.created_at).toLocaleString()}
                        </small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminAnnouncements;
