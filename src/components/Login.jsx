/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "../styles/Login.css"; // Import CSS file for styling
import { loading_gif } from "../assets";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showGif, setShowGif] = useState(false); // State to control GIF visibility
  const navigate = useNavigate(); // Initialize navigate hook

  const handleLogin = async () => {
    setShowGif(true);
    try {
      console.log(username, password);
      const response = await fetch("http://13.202.7.118:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Include the password in the request body
      });

      if (!response.ok) {
        setShowGif(false);
        throw new Error("Failed to log in");
      }
      setShowGif(false);
      // Successful login logic (navigate to dashboard)
      navigate("/panel");
    } catch (error) {
      // Display error message for failed login attempt
      alert("Failed to log in. Please check your credentials.");
    }
  };

  const handleLoginClick = () => {
    handleLogin();
    // Show the GIF on button click
  };

  return (
    <>
      {!showGif && (
        <div className="login-container">
          <div className="login-content">
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username here"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password here"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="login-btn" onClick={handleLoginClick}>
              LOGIN
            </button>
          </div>
        </div>
      )}
      {showGif && (
        <div className="fullscreen-gif">
          <img src={loading_gif} alt="Loading..." />
        </div>
      )}
    </>
  );
}

export default Login;
