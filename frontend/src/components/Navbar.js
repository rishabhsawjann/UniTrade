import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const isLoggedIn = !!localStorage.getItem('token');
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          StudentMarket
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/items" className="nav-link">Browse Items</Link>
          </li>
          {isLoggedIn && (
            <li className="nav-item">
              <Link to="/my-listings" className="nav-link">My Listings</Link>
            </li>
          )}
          <li className="nav-item">
            <Link to="/create-item" className="nav-link">Sell Item</Link>
          </li>
        </ul>
        {isLoggedIn && (
          <button onClick={handleLogout} style={{ marginLeft: 16, background: '#e53e3e', color: 'white', border: 'none', borderRadius: 6, padding: '10px 18px', fontWeight: 600, cursor: 'pointer' }}>Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 