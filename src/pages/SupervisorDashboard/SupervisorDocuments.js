import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SupervisorDocuments.css"; // Import CSS file

const SupervisorDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="doc-container">
            <h2>Student Uploaded Documents</h2>

            {loading && <p className="status-text">⏳ Loading documents...</p>}
            {error && <p className="error-text">{error}</p>}

            {!loading && !error && documents.length > 0 ? (
                <table className="doc-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Type</th>
                            <th>Title</th>
                            <th>Student</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map((doc, index) => (
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
                !loading && !error && <p className="status-text">No documents uploaded yet.</p>
            )}
        </div>
    );
};

export default SupervisorDocuments;
