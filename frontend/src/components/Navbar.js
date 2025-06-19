import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const isLoggedIn = !!localStorage.getItem('token');

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
      </div>
    </nav>
  );
}

export default Navbar; 