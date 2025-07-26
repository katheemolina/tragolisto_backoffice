import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/api';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTragos: 0,
    totalIngredientes: 0,
    totalJuegos: 0,
    totalUsuarios: 0
  });
  const [tragosPopulares, setTragosPopulares] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar indicadores
      console.log('Cargando indicadores...');
      const indicadoresRes = await dashboardService.getIndicadores();
      console.log('Indicadores:', indicadoresRes.data);
      
      if (indicadoresRes.data.success) {
        setStats({
          totalTragos: indicadoresRes.data.data.total_tragos,
          totalIngredientes: indicadoresRes.data.data.total_ingredientes,
          totalJuegos: indicadoresRes.data.data.total_juegos,
          totalUsuarios: indicadoresRes.data.data.total_usuarios
        });
      }
      
      // Cargar top tragos
      console.log('Cargando top tragos...');
      const topTragosRes = await dashboardService.getTopTragos();
      console.log('Top tragos:', topTragosRes.data);
      
      setTragosPopulares(topTragosRes.data);
      
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      toast.error('Error al cargar los datos del dashboard');
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

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalUsuarios}</h3>
            <p className="stat-label">Total Usuarios</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="popular-drinks">
          <h2>Top 5 Tragos Más Favoritos</h2>
          <div className="popular-list">
            {tragosPopulares.length > 0 ? (
              tragosPopulares.map((trago, index) => (
                <div key={trago.trago_id} className="popular-item">
                  <div className="popular-rank">#{index + 1}</div>
                  <div className="popular-info">
                    <h4>{trago.nombre}</h4>
                    <p className="popular-desc">{trago.descripcion}</p>
                    <p className="popular-favorites">{trago.total_favoritos} favoritos</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">
                <p>No hay datos de tragos favoritos disponibles</p>
              </div>
            )}
          </div>
        </div>

        <div className="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="actions-grid">
            <button className="action-btn" onClick={() => window.location.href = '/tragos'}>
              <span className="action-icon">🍹</span>
              <span>Gestionar Tragos</span>
            </button>
            <button className="action-btn" onClick={() => window.location.href = '/ingredientes'}>
              <span className="action-icon">🥤</span>
              <span>Gestionar Ingredientes</span>
            </button>
            <button className="action-btn" onClick={() => window.location.href = '/juegos'}>
              <span className="action-icon">🎮</span>
              <span>Gestionar Juegos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 