import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle">
      <button 
        className={`toggle-button ${isDarkMode ? 'dark' : 'light'}`}
        onClick={toggleTheme}
        aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        <div className="toggle-icon">
          {isDarkMode ? '☀️' : '🌙'}
        </div>
        <span className="toggle-label">
          {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle; 