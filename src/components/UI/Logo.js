import React from 'react';
import './Logo.css';

const Logo = ({ className = '' }) => {
  return (
    <div className={`logo-placeholder ${className}`}>
      <span className="logo-text">T</span>
    </div>
  );
};

export default Logo; 