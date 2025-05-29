import React from "react";
import "./Header.css"; // Importing styles

const Header = () => {
    return (
        <header className="header">
            <div className="logo-container">
                <img src="/ngao1.png" alt="System Logo" className="logo" />
                <h1>Project & Dissertation Management System</h1>
                <img src="/ardhi2.png" alt="University Logo" className="logo" />
            </div>
        </header>
    );
};

export default Header;
