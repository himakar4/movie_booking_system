import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ user, logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* ===== TOP NAVBAR ===== */}
      <nav className="navbar top-navbar">
        <div className="navbar-container">
          {/* Brand (Left) */}
          <Link to="/" className="navbar-brand">
            🎬 MovieBooking
          </Link>

          {/* Search Bar (Center) */}
          <div className="navbar-search">
            <input type="text" placeholder="Search for Movies..." />
            <button>Search</button>
          </div>

          {/* Right Side (Welcome + Logout) */}
          <div className="navbar-right">
            {user && <span className="navbar-user">Welcome, {user.name}</span>}
            {user && (
              <button onClick={handleLogout} className="navbar-logout-btn">
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ===== BOTTOM NAVBAR ===== */}
      <nav className="navbar bottom-navbar">
        <div className="navbar-container">
          {/* Movies should link to "/" like previous Home */}
          <Link to="/" className="navbar-item">
            Movies
          </Link>

          {user && (
            <Link to="/profile" className="navbar-item">
              Profile
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
