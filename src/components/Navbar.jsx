import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = () => {
    alert("You have been signed out!");
    navigate("/signup"); // ✅ Redirects to Sign-in page
  };

  return (
    <motion.nav 
      className="navbar"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      {/* Left - Website Name */}
      <Link to="/" className="nav-logo">Expense Manager</Link>

      {/* Right - Profile Dropdown */}
      <div className="profile-container">
        <button className="profile-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
          username ▼
        </button>

        {dropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/profile" className="dropdown-item"><FaUser /> My Profile</Link>
            <button className="dropdown-item signout" onClick={handleSignOut}><FaSignOutAlt /> Sign Out</button>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
