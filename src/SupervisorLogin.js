import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
// import "./LoginForm.css"; // Import styles

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Logging in with:", username, password);

        // Authentication logic goes here (optional)

        // Redirect to dashboard
        navigate("/supervisor-dashboard");
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src="/ardhi2.png" alt="University Logo" className="logo" />
                <h2>Welcome to login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            placeholder="Enter Email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
