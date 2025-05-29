import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginForm.css";

const LoginForm = () => {
    const [regNumber, setRegNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login/", {
                reg_number: regNumber,
                password: password,
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("regNumber", regNumber);
                navigate("/student-dashboard");
            } else {
                setError("Login failed. No token received.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.error || "Invalid registration number or password.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src="/ardhi2.png" alt="University Logo" className="logo" />
                <h2>Student Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Registration Number:</label>
                        <input
                            type="text"
                            value={regNumber}
                            onChange={(e) => setRegNumber(e.target.value)}
                            required
                            placeholder="Enter your registration number"
                        />
                    </div>
                    <div className="input-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">Login</button>
                </form>
                <p className="back-link">
                    Don't have an account? <a href="/registration">Register</a>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
