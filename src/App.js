import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
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
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tragos" element={<Tragos />} />
            <Route path="/ingredientes" element={<Ingredientes />} />
            <Route path="/juegos" element={<Juegos />} />
          </Routes>
        </Layout>
      </Router>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App; 