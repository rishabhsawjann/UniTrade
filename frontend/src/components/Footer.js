import React from 'react';

function Footer() {
  return (
    <footer style={{
      width: '100%',
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center',
      padding: '18px 0',
      position: 'fixed',
      left: 0,
      bottom: 0,
      zIndex: 1000,
      fontWeight: 500,
      fontSize: '1.05rem',
      letterSpacing: '0.5px',
      boxShadow: '0 -2px 12px rgba(102, 126, 234, 0.08)'
    }}>
      &copy; {new Date().getFullYear()} StudentMarket &mdash; <a href="#" style={{ color: 'white', textDecoration: 'underline', fontWeight: 600 }}>GitHub</a>
    </footer>
  );
}

export default Footer; 