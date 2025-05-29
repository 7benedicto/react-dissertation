import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./FinalDocumentUpload.css";

const FileUploadForm = ({ groups = [] }) => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [description, setDescription] = useState("");
  const [groupId, setGroupId] = useState(""); // For group uploads
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleFileTypeChange = (e) => setFileType(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleGroupChange = (e) => setGroupId(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !fileType) {
      setUploadStatus("Please select a file and file type.");
      return;
    }

    const token = localStorage.getItem("token"); // 👈 Get token from localStorage
    if (!token) {
      setUploadStatus("Authentication token not found.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", fileType);
    formData.append("description", description);
    if (groupId) formData.append("group_id", groupId);

    try {
      await axios.post("/api/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`, // 👈 Add token to request
        },
      });
      setUploadStatus("File uploaded successfully.");
    } catch (error) {
      setUploadStatus("An error occurred during upload.");
    }
  };

  return (
    <div className="upload-form-container">
      <h2>Upload File</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="file">Select File:</label>
          <input type="file" id="file" onChange={handleFileChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="fileType">File Type:</label>
          <select
            id="fileType"
            value={fileType}
            onChange={handleFileTypeChange}
            required
          >
            <option value="">Select Type</option>
            <option value="document">Document</option>
            <option value="source_code">Source Code</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="group">Group (Optional):</label>
          <select id="group" value={groupId} onChange={handleGroupChange}>
            <option value="">Select Group</option>
            {Array.isArray(groups) &&
              groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            rows="4"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Add a description (optional)"
          />
        </div>

        <button type="submit">Upload</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

FileUploadForm.propTypes = {
  groups: PropTypes.array,
};

export default FileUploadForm;
