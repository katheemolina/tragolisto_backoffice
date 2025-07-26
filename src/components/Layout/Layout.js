import React from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from '../UI/ThemeToggle';
import logoImg from '../../assets/portada.png';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <img src={logoImg} alt="Tragolisto Logo" className="logo" />
          </div>
          {/* <h2>Tragolisto</h2> */}
          <p>Backoffice</p>
        </div>
        <ul className="nav-menu">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <span className="nav-icon">🏠</span>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/tragos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <span className="nav-icon">🍹</span>
              Tragos
            </NavLink>
          </li>
          <li>
            <NavLink to="/ingredientes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <span className="nav-icon">🥤</span>
              Ingredientes
            </NavLink>
          </li>
          <li>
            <NavLink to="/juegos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <span className="nav-icon">🎮</span>
              Juegos
            </NavLink>
          </li>
        </ul>
        <div className="sidebar-bottom">
          <ThemeToggle />
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 