// src/HomePage.js
import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
    return (
        <div className="homepage-container">
            <h1>Welcome to the Project & Dissertation Management System</h1>
            <p>Please select your login type:</p>
            <div className="nav-links">
                <Link to="/student-login" className="nav-button">Student Login</Link>
                {/* <Link to="/supervisor-login" className="nav-button">Supervisor Login</Link> */}
                <Link to="/registration" className="nav-button">Student Registration</Link>
                <Link to="/admin-login" className="nav-button">Administrative staff</Link>
            </div>
        </div>
    );
};

export default HomePage;
