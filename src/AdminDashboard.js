import React from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <aside className="sidebar">
                <h2>Admin Dashboard</h2>
                <nav>
                    <ul>
                        <li>
                            <Link to="/admin-dashboard/students">Student List</Link>
                        </li>
                        <li>
                        <Link to="/admin-dashboard/assign-supervisor">Assign Supervisor</Link>
                        </li>
                        <li>
                        <Link to="/admin-dashboard/assign-group-supervisor">Assign Group Supervisor</Link>
                        </li>
                        <li>
                            <Link to="/admin-dashboard/admin-announcements">Announcements</Link>
                        </li>
                        <li>
                            <Link to="/admin-dashboard/add-supervisor">Add Supervisor</Link>
                        </li>
                        <li>
                            <Link to="/admin-dashboard/user-profile">User Profile</Link>
                        </li>
                        <li>
                            <Link to="/admin-dashboard/manage-stages">Stage</Link>
                        </li>
                        <li>
                            <Link to="/admin-dashboard/grouped-student-list">Students</Link>
                        </li>
                        <li>
                            <Link to="/admin-dashboard/auto-group-generator">Group Generator</Link>
                        </li>
                        <li>
                            <Link to="/admin-dashboard/project-group-list">Project Groups</Link>
                        </li>
                        <li>
                            <Link to="/admin-dashboard/admin-repository">Repository</Link>
                        </li>
                        <li>
                            <Link to="/admin-dashboard/other-feature">Other Feature</Link>
                        </li>
                        <li>
                            <Link to="/" className="logout-button">Logout</Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="content">
                <h1>Welcome, Admin</h1>
                <p>Select an option from the sidebar to manage the system.</p>
            </main>
        </div>
    );
};

export default AdminDashboard;
