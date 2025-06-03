import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SupervisorDocuments.css";

const SupervisorDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("all"); // "all" | "student" | "group"

    useEffect(() => {
        const fetchDocuments = async () => {
            const token = localStorage.getItem("authToken");

            if (!token) {
                setError("❌ No authentication token found. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get("http://127.0.0.1:8000/api/supervisor-documents/", {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setDocuments(response.data);
            } catch (err) {
                console.error("Error fetching documents:", err);
                setError("❌ Failed to fetch documents.");
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    const getFileTypeIcon = (filename) => {
        const ext = filename.split(".").pop().toLowerCase();
        switch (ext) {
            case "pdf":
                return "📄";
            case "doc":
            case "docx":
                return "📝";
            case "ppt":
            case "pptx":
                return "📊";
            case "zip":
            case "rar":
                return "🗂️";
            default:
                return "📁";
        }
    };

    const filteredDocuments = documents.filter((doc) => {
        if (filterType === "student") return doc.content_type_name === "student";
        if (filterType === "group") return doc.content_type_name === "projectgroup";
        return true;
    });

    return (
        <div className="doc-container">
            <h2>📂 Supervisor Document View</h2>

            <div className="doc-filter-buttons">
                <button onClick={() => setFilterType("all")} disabled={filterType === "all"}>
                    🧾 All
                </button>
                <button onClick={() => setFilterType("student")} disabled={filterType === "student"}>
                    👤 Student Docs
                </button>
                <button onClick={() => setFilterType("group")} disabled={filterType === "group"}>
                    👥 Group Docs
                </button>
            </div>

            {loading && <p className="status-text">⏳ Loading documents...</p>}
            {error && <p className="error-text">{error}</p>}

            {!loading && !error && filteredDocuments.length > 0 ? (
                <table className="doc-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Type</th>
                            <th>Title</th>
                            <th>{filterType === "group" ? "Group" : "Owner"}</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocuments.map((doc, index) => (
                            <tr key={doc.id}>
                                <td>{index + 1}</td>
                                <td>{getFileTypeIcon(doc.file)}</td>
                                <td>{doc.title}</td>
                                <td>{doc.full_name || "N/A"}</td>
                                <td>{new Date(doc.uploaded_at).toLocaleString()}</td>
                                <td>
                                    <a
                                        href={`http://127.0.0.1:8000${doc.file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="doc-link view"
                                    >
                                        🔍 View
                                    </a>
                                    <a
                                        href={`http://127.0.0.1:8000${doc.file}`}
                                        download
                                        className="doc-link download"
                                    >
                                        ⬇ Download
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !loading && !error && <p className="status-text">No documents to show.</p>
            )}
        </div>
    );
};

export default SupervisorDocuments;
