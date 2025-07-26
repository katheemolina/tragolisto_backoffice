import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from '../UI/ThemeToggle';
import logoImg from '../../assets/portada.png';
import { toast } from 'react-toastify';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    toast.success('Sesión cerrada exitosamente');
    navigate('/login');
  };

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
          <button 
            onClick={handleLogout}
            className="logout-btn"
            title="Cerrar sesión"
          >
            <span className="logout-icon">🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 