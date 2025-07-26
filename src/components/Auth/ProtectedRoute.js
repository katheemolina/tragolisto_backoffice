import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Login from '../../pages/Login/Login';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const authStatus = localStorage.getItem('isAuthenticated');
      const loginTime = localStorage.getItem('loginTime');
      
      console.log('Checking auth status:', { authStatus, loginTime });
      
      if (authStatus === 'true' && loginTime) {
        // Verificar si la sesión no ha expirado (24 horas)
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
        
        console.log('Session check:', { loginDate, now, hoursDiff });
        
        if (hoursDiff < 24) {
          console.log('User is authenticated');
          setIsAuthenticated(true);
        } else {
          // Sesión expirada
          console.log('Session expired');
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('user');
          localStorage.removeItem('loginTime');
          setIsAuthenticated(false);
        }
      } else {
        console.log('User is not authenticated');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Si no está autenticado, mostrar login
    return <Login />;
  }

  // Si está autenticado, mostrar el contenido protegido
  return children;
};

export default ProtectedRoute; 