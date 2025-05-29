import React, { useState } from "react";
import AssignedSupervisor from "./AssignedSupervisor";
import AssignedGroupSupervisor from "./AssignedGroupSupervisor";
import FeedbackSection from "./FeedbackSection";
import ConsultationSchedule from "./ConsultationSchedule";
import Announcements from "./Announcements";
import TitleRegistration from "./TitleRegistration";
import StudentUploads from "./StudentUploads";
import GroupUpload from "./GroupUpload";
import StudentConsultationStatus from "./StudentConsultations";
import StudentProfile from "./StudentProfile";
import StudentProgress from "./StudentProgress";
import MyGroup from "./MyGroup";
import FinalDocumentUpload from "./FinalDocumentUpload"
import "./StudentDashboard.css";

const StudentDashboard = () => {
    const [activeSection, setActiveSection] = useState("supervisor");

    const handleLogout = () => {
        localStorage.removeItem("regNumber");
        window.location.href = "/student-login";
    };

    const renderSection = () => {
        switch (activeSection) {
            case "supervisor":
                return <AssignedSupervisor />;
            case "groupsupervisor":
                return <AssignedGroupSupervisor />;
            case "feedback":
                return <FeedbackSection />;
            case "schedule":
                return <ConsultationSchedule />;
            case "announcements":
                return <Announcements />;
            case "title":
                return <TitleRegistration />;
            case "upload":
                return <StudentUploads />;
            case "uploading":
                return <GroupUpload />
            case "consultations":
                return <StudentConsultationStatus />;
            case "progress":
                return <StudentProgress />;
            case "group":
                return <MyGroup />;
            case "finalupload":
                return <FinalDocumentUpload />;
            case "profile":
                return <StudentProfile />;
            default:
                return <AssignedSupervisor />;
        }
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <h2>📚 Student Dashboard</h2>
                <ul>
                    <li
                        className={activeSection === "supervisor" ? "active" : ""}
                        onClick={() => setActiveSection("supervisor")}
                    >
                        📌 Supervisor
                    </li>
                    <li
                        className={activeSection === "groupsupervisor" ? "active" : ""}
                        onClick={() => setActiveSection("groupsupervisor")}
                    >
                        📌 Group Supervisor
                    </li>
                    <li
                        className={activeSection === "feedback" ? "active" : ""}
                        onClick={() => setActiveSection("feedback")}
                    >
                        📝 Feedback
                    </li>
                    <li
                        className={activeSection === "schedule" ? "active" : ""}
                        onClick={() => setActiveSection("schedule")}
                    >
                        📅 Schedule
                    </li>
                    <li
                        className={activeSection === "announcements" ? "active" : ""}
                        onClick={() => setActiveSection("announcements")}
                    >
                        📢 Announcements
                    </li>
                    <li
                        className={activeSection === "title" ? "active" : ""}
                        onClick={() => setActiveSection("title")}
                    >
                        📄 Title Registration
                    </li>
                    <li
                        className={activeSection === "upload" ? "active" : ""}
                        onClick={() => setActiveSection("upload")}
                    >
                        📤 Upload
                    </li>
                    <li
                        className={activeSection === "uploading" ? "active" : ""}
                        onClick={() => setActiveSection("uploading")}
                    >
                        📤 Uploading
                    </li>
                    <li
                        className={activeSection === "consultations" ? "active" : ""}
                        onClick={() => setActiveSection("consultations")}
                    >
                        ✅ Consultation Status
                    </li>
                    <li
                        className={activeSection === "group" ? "active" : ""}
                        onClick={() => setActiveSection("group")}
                    >
                        📊 My Group
                    </li>
                    <li
                        className={activeSection === "progress" ? "active" : ""}
                        onClick={() => setActiveSection("progress")}
                    >
                        📊 Progress
                    </li>
                    <li
                        className={activeSection === "finalupload" ? "active" : ""}
                        onClick={() => setActiveSection("finalupload")}
                    >
                        final upload
                    </li>
                    <li
                        className={activeSection === "profile" ? "active" : ""}
                        onClick={() => setActiveSection("profile")}
                    >
                        🙍‍♂️ Profile
                    </li>
                </ul>

                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </aside>

            <main className="dashboard-main">{renderSection()}</main>
        </div>
    );
};

export default StudentDashboard;
