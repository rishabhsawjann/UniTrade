import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to Student Marketplace</h1>
        <p className="welcome-subtitle">Buy and sell with fellow students. Discover great deals, declutter, and connect with your campus community.</p>
        <button className="welcome-register-btn" onClick={() => navigate('/register')}>Get Started</button>
      </div>
      <div className="welcome-login-link">
        Already have an account?{' '}
        <span className="welcome-login-btn" onClick={() => navigate('/login')}>Login</span>
      </div>
    </div>
  );
}

export default Welcome; 