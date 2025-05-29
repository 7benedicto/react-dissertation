import React, { useState } from "react";
import AssignedStudents from "./AssignedStudents";
import AssignedGroups from "./AssignedGroups";
import FeedbackSection from "./FeedbackSection";
import ConsultationSchedule from "./ConsultationSchedule";
import Announcements from "./Announcements";
import SupervisorDocuments from "./SupervisorDocuments";
import UserProfile from "../../UserProfile";
import CreateMilestone from "./CreateMilestone";
import SupervisorMilestone from "./SupervisorMilestone";
import "./styles.css"; // Make sure styles are linked correctly

const SupervisorDashboard = () => {
    const [section, setSection] = useState("students");

    const handleLogout = () => {
        // Clear localStorage or specific keys
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("username");

        // Redirect to login page
        window.location.href = "/admin-login";
    };

    const renderSection = () => {
        switch (section) {
            case "students":
                return <AssignedStudents />;
            case "groups":
                return <AssignedGroups />;
            case "feedback":
                return <FeedbackSection />;
            case "schedule":
                return <ConsultationSchedule />;
            case "announcements":
                return <Announcements />;
            case "documents":
                return <SupervisorDocuments />;
            case "milestone":
                return <CreateMilestone />;
            case "progress":
                return <SupervisorMilestone />;
            case "profile":
                return <UserProfile />;
            default:
                return <AssignedStudents />;
        }
    };

    return (
        <div className="dashboard-container">
            <aside className="dashboard-sidebar">
                <h3>Supervisor Panel</h3>
                <ul>
                    <li
                        className={section === "students" ? "active" : ""}
                        onClick={() => setSection("students")}
                    >
                        Assigned Students
                    </li>
                    <li
                        className={section === "groups" ? "active" : ""}
                        onClick={() => setSection("groups")}
                    >
                        Assigned Groups
                    </li>
                    <li
                        className={section === "feedback" ? "active" : ""}
                        onClick={() => setSection("feedback")}
                    >
                        Feedback
                    </li>
                    <li
                        className={section === "schedule" ? "active" : ""}
                        onClick={() => setSection("schedule")}
                    >
                        Consultation Schedule
                    </li>
                    <li
                        className={section === "announcements" ? "active" : ""}
                        onClick={() => setSection("announcements")}
                    >
                        Announcements
                    </li>
                    <li
                        className={section === "documents" ? "active" : ""}
                        onClick={() => setSection("documents")}
                    >
                        Documents
                    </li>
                    <li
                        className={section === "milestone" ? "active" : ""}
                        onClick={() => setSection("milestone")}
                    >
                        Milestone
                    </li>
                    <li
                        className={section === "progress" ? "active" : ""}
                        onClick={() => setSection("progress")}
                    >
                        Progress
                    </li>
                    <li
                        className={section === "profile" ? "active" : ""}
                        onClick={() => setSection("profile")}
                    >
                        Profile
                    </li>
                </ul>

                {/* Logout button */}
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </aside>

            <main className="dashboard-main">
                {renderSection()}
            </main>
        </div>
    );
};

export default SupervisorDashboard;
