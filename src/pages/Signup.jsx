import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css"; // ✅ Import Signup styles

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    // Save user data to localStorage
    const userData = { user: username, password };
    localStorage.setItem("registeredUser", JSON.stringify(userData));

    alert("Signup successful! Redirecting to Home...");
    navigate("/home"); // ✅ Redirect to Home after signup
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>

      {/* ✅ Navigate to Register Page */}
      <p className="redirect-text">
        Already have an account?{" "}
        <span onClick={() => navigate("/register")} className="register-link">
          Register
        </span>
      </p>
    </div>
  );
};

export default Signup;
