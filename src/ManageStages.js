import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageStages.css";
import { useNavigate } from "react-router-dom";

// Helper function to get auth headers
const getAuthConfig = () => ({
    headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
    },
});

const ManageStages = () => {
    const [stages, setStages] = useState([]);
    const [newStage, setNewStage] = useState({ name: "", description: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStages = async () => {
            try {
                const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
                const response = await axios.get(
                    `${BASE_URL}/api/stages/`,
                    getAuthConfig()
                );
                setStages(response.data);
            } catch (error) {
                console.error("Error fetching stages:", error);
                setMessage("Failed to fetch stages.");
            }
        };

        fetchStages();
    }, []);

    const handleAddStage = async (e) => {
        e.preventDefault();
        try {
            const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
            const response = await axios.post(
                `${BASE_URL}/api/stages/`,
                newStage,
                getAuthConfig()
            );
            setStages([...stages, response.data]);
            setMessage("Stage added successfully!");
            setNewStage({ name: "", description: "" });
        } catch (error) {
            console.error("Error adding stage:", error);
            setMessage("Failed to add stage.");
        }
    };

    const handleDeleteStage = async (stageId) => {
        try {
            const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
            await axios.delete(
                `${BASE_URL}/api/stages/${stageId}/`,
                getAuthConfig()
            );
            setStages(stages.filter((stage) => stage.id !== stageId));
            setMessage("Stage deleted successfully.");
        } catch (error) {
            console.error("Error deleting stage:", error);
            setMessage("Failed to delete stage.");
        }
    };

    return (
        <div className="manage-stages-container">
            {/* Back Button */}
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <h2>Manage Stages</h2>
            <form onSubmit={handleAddStage}>
                <input
                    type="text"
                    placeholder="Stage Name"
                    value={newStage.name}
                    onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Stage Description"
                    value={newStage.description}
                    onChange={(e) => setNewStage({ ...newStage, description: e.target.value })}
                ></textarea>
                <button type="submit">Add Stage</button>
            </form>

            {message && <p className="message">{message}</p>}

            <ul>
                {stages.map((stage) => (
                    <li key={stage.id}>
                        <strong>{stage.name}</strong>: {stage.description}
                        <button onClick={() => handleDeleteStage(stage.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageStages;
