import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminLoginForm.css";

const AdminLoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // To Clear previous errors

        try {
            // Make API call to authenticate
            const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
            const response = await axios.post(`${BASE_URL}/api/admin-login/`, {
                email,  // Assuming email is the username
                password,
            });
            console.log(response.data);

            const { role, username, token } = response.data;

            // We save user details and token in localStorage
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userRole", role);
            localStorage.setItem("username", username); // Optional
            localStorage.setItem("authToken", token); // Save token for API authentication

            // Navigate to the appropriate dashboard
            if (role === "admin") {
                navigate("/admin-dashboard");
            } else if (role === "supervisor") {
                navigate("/supervisor-dashboard");
            } else {
                setError("You are not authorized to access this system.");
            }
        } catch (err) {
            // Handle errors based on response status
            if (err.response) {
                if (err.response.status === 401) {
                    setError("Invalid email or password.");
                } else if (err.response.status === 403) {
                    setError("You are not assigned a valid role.");
                } else {
                    setError("An unexpected error occurred. Please try again.");
                }
            } else {
                setError("Unable to connect to the server. Please check your internet connection.");
            }
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <h2>Administrative staff Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginForm;
