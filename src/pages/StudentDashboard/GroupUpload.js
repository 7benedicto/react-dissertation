import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StudentUpload.css";

const GroupUpload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isGroupLeader, setIsGroupLeader] = useState(false);
  const [supervisorUsername, setSupervisorUsername] = useState("");
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [documentDetails, setDocumentDetails] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
        const res = await axios.get(`${BASE_URL}/api/student-profile/`, {
          headers: { Authorization: `Token ${token}` },
        });

        const { is_group_leader, supervisor } = res.data;
        setIsGroupLeader(is_group_leader);
        setSupervisorUsername(supervisor || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage("❌ Failed to load profile.");
      } finally {
        setProfileLoaded(true);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!title || !file) {
      setMessage("⚠️ Please provide both a title and a file.");
      return;
    }

    if (!isGroupLeader) {
      setMessage("❌ Only group leaders can upload group documents.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    formData.append("supervisor", supervisorUsername || "");

    const token = localStorage.getItem("token");
    const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
    const url = `${BASE_URL}/api/upload-group-document//`;

    try {
      setIsUploading(true);

      const res = await axios.post(url, formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("✅ Group document uploaded successfully.");
      setDocumentDetails(res.data);
      setTitle("");
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg = err.response?.data?.error || "❌ Upload failed. Please try again.";
      setMessage(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  if (!profileLoaded) return <p>🔄 Loading student profile...</p>;

  return (
    <div className="upload-container">
      <h2>Upload Group Document</h2>

      <form onSubmit={handleSubmit}>
        <div className="upload-form-group">
          <label htmlFor="title">📌 Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="upload-form-group">
          <label htmlFor="file">📁 File:</label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        <button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "⬆ Upload"}
        </button>
      </form>

      {message && <p className="upload-message">{message}</p>}

      {documentDetails && (
        <div className="uploaded-document-details">
          <h3>📄 Uploaded Group Document Details:</h3>
          <p><strong>Title:</strong> {documentDetails.title}</p>
          {documentDetails.file && (
            <p>
              <strong>File:</strong>{" "}
              <a href={documentDetails.file} target="_blank" rel="noopener noreferrer">
                Download
              </a>
            </p>
          )}
          {documentDetails.supervisor && (
            <p>
              <strong>Supervisor:</strong>{" "}
              {typeof documentDetails.supervisor === "object"
                ? documentDetails.supervisor.username || JSON.stringify(documentDetails.supervisor)
                : documentDetails.supervisor}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupUpload;
