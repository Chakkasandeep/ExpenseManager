import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/forms.css";
import maleAvatar from "../assets/male.png";
import femaleAvatar from "../assets/female.png";

const Login = () => {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("male");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("registeredUser", JSON.stringify({ user, password }));
    navigate("/signup"); // Redirect to Signup
  };

  return (
    <div className="form-container login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={user} onChange={(e) => setUser(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div className="avatar-selection">
          <img src={maleAvatar} alt="Male" className={gender === "male" ? "selected" : ""} onClick={() => setGender("male")} />
          <img src={femaleAvatar} alt="Female" className={gender === "female" ? "selected" : ""} onClick={() => setGender("female")} />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Login;
