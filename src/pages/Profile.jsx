import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  // Sample User Data (You can replace it with actual data from backend)
  const user = {
    name: "John Doe", // Replace with registered name
    username: "johndoe123", // Replace with registered username
    gender: "male", // Change to "female" for female profile
  };

  // Profile Picture based on Gender
  const profilePic =
    user.gender === "male"
      ? "/images/male.png" // Male Profile Image
      : "/images/female.png"; // Female Profile Image

  // Handle Logout
  const handleLogout = () => {
    // Here you can also clear authentication data if needed
    navigate("/signin"); // Redirect to Sign In Page
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src={profilePic} alt="Profile" className="profile-pic" />
        <h2>{user.name}</h2>
        <p>@{user.username}</p>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
