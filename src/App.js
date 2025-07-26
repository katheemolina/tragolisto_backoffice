import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from './pages/Dashboard/Dashboard';
import Tragos from './pages/Tragos/Tragos';
import Ingredientes from './pages/Ingredientes/Ingredientes';
import Juegos from './pages/Juegos/Juegos';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/tragos" element={
            <ProtectedRoute>
              <Layout>
                <Tragos />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/ingredientes" element={
            <ProtectedRoute>
              <Layout>
                <Ingredientes />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/juegos" element={
            <ProtectedRoute>
              <Layout>
                <Juegos />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App; 