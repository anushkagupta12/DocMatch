import './Auth.css';

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {

  const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("authenticated");
        if (isAuthenticated) {
            navigate("/home"); // Redirect to home page if already authenticated
        }
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate authentication
        if (username === "user" && password === "pass") {
            localStorage.setItem("authenticated", true); // Set authentication status
            navigate("/home"); // Redirect to home page
        } else {
            alert("Invalid credentials");
        }
    };


  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form">
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

