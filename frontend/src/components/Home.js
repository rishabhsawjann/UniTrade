import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Buy and Sell with Fellow Students
          </h1>
          <p className="hero-subtitle">
            Connect with students in your area to buy and sell clothes, books, electronics, and more!
          </p>
          <div className="hero-buttons">
            <Link to="/items" className="btn btn-primary">
              Browse Items
            </Link>
            <Link to="/create-item" className="btn btn-secondary">
              Sell Your Item
            </Link>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Why Choose StudentMarket?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Local Connections</h3>
            <p>Find items and buyers near your campus</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Great Prices</h3>
            <p>Student-friendly prices for student budgets</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Trusted Community</h3>
            <p>Buy and sell with verified student accounts</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Easy to Use</h3>
            <p>Simple interface for quick transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 