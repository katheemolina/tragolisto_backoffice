import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTragos: 0,
    totalIngredientes: 0,
    totalJuegos: 0,
    tragosPopulares: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Por ahora usamos datos mock, luego conectaremos con el backend
      const mockStats = {
        totalTragos: 25,
        totalIngredientes: 45,
        totalJuegos: 8,
        tragosPopulares: [
          { id: 1, nombre: 'Mojito', visitas: 150 },
          { id: 2, nombre: 'Margarita', visitas: 120 },
          { id: 3, nombre: 'Piña Colada', visitas: 95 },
          { id: 4, nombre: 'Daiquiri', visitas: 80 },
          { id: 5, nombre: 'Cosmopolitan', visitas: 65 }
        ]
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Resumen general de la plataforma</p>
        </div>
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Resumen general de la plataforma</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🍹</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalTragos}</h3>
            <p className="stat-label">Total Tragos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🥤</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalIngredientes}</h3>
            <p className="stat-label">Total Ingredientes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalJuegos}</h3>
            <p className="stat-label">Total Juegos</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="popular-drinks">
          <h2>Tragos Más Populares</h2>
          <div className="popular-list">
            {stats.tragosPopulares.map((trago, index) => (
              <div key={trago.id} className="popular-item">
                <div className="popular-rank">#{index + 1}</div>
                <div className="popular-info">
                  <h4>{trago.nombre}</h4>
                  <p>{trago.visitas} visitas</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="actions-grid">
            <button className="action-btn">
              <span className="action-icon">➕</span>
              <span>Agregar Trago</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">🥤</span>
              <span>Agregar Ingrediente</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">🎮</span>
              <span>Agregar Juego</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 