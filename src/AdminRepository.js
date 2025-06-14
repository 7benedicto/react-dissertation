import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminRepository.css";
import { useNavigate } from "react-router-dom";

const AdminRepository = () => {
  const [files, setFiles] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedYear, setSelectedYear] = useState(""); // 👈 Year filter
  const [expandedStudent, setExpandedStudent] = useState(null); // Toggle view
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      try {
        const params = new URLSearchParams();
        if (filter) params.append("file_type", filter);
        if (selectedYear) params.append("year", selectedYear);

        const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
        const response = await axios.get(
          `${BASE_URL}/api/repository/?${params.toString()}`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setFiles(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [filter, selectedYear]);

  // Group files by student or group name
  const groupedFiles = files.reduce((acc, file) => {
    const owner = file.student_name || file.group_name || "Unknown";
    if (!acc[owner]) {
      acc[owner] = [];
    }
    acc[owner].push(file);
    return acc;
  }, {});

  // Toggle visibility
  const toggleStudent = (name) => {
    setExpandedStudent((prev) => (prev === name ? null : name));
  };

  return (
    <div className="admin-repository">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

      <h2>Repository Management</h2>

      <div className="filter-section" style={{ marginBottom: "20px" }}>
        <label htmlFor="fileType" style={{ marginRight: "10px" }}>
          Filter by File Type:
        </label>
        <select
          id="fileType"
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
        >
          <option value="">All</option>
          <option value="document">Documents</option>
          <option value="source_code">Source Codes</option>
        </select>

        <label htmlFor="year" style={{ marginLeft: "30px", marginRight: "10px" }}>
          Filter by Year:
        </label>
        <input
          id="year"
          type="text"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          placeholder="e.g., 2024"
          style={{ width: "100px" }}
        />
      </div>

      <div className="student-list">
        {Object.entries(groupedFiles).map(([owner, ownerFiles]) => (
          <div key={owner} className="student-section" style={{ marginBottom: "20px" }}>
            <h3 onClick={() => toggleStudent(owner)}>{owner}</h3>

            {expandedStudent === owner && (
              <table className="repository-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>File</th>
                    <th>File Type</th>
                    <th>Description</th>
                    <th>Uploaded At</th>
                    <th>Version</th>
                    <th>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {ownerFiles.map((file, index) => (
                    <tr key={file.id}>
                      <td>{index + 1}</td>
                      <td>
                        <a
                          href={file.file}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View File
                        </a>
                      </td>
                      <td>{file.file_type}</td>
                      <td>{file.description}</td>
                      <td>{new Date(file.uploaded_at).toLocaleString()}</td>
                      <td>{file.version}</td>
                      <td>{file.year || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRepository;


