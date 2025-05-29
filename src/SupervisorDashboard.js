import React from "react";
import "./Dashboard.css"; // Import styles

const SupervisorDashboard = () => {
    return (
        <div>
            <div className="dashboard-container">
                <h2>Welcome dear supervisor to your section</h2>
                <div className="card-container">
                    <div className="dashboard-card">Student List</div>
                    <div className="dashboard-card">Feedback Section</div>
                    <div className="dashboard-card">Consultation Schedule</div>
                    <div className="dashboard-card">Announcements Management</div>
                </div>
            </div>
        </div>
    );
};

export default SupervisorDashboard;