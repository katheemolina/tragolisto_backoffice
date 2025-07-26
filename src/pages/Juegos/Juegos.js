import React, { useState, useEffect } from 'react';
import Button from '../../components/UI/Button';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import { juegosService } from '../../services/api';
import './Juegos.css';

const Juegos = () => {
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJuego, setEditingJuego] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    instrucciones: '',
    categoria: 'bebida',
    jugadores_min: 2,
    jugadores_max: 8,
    duracion_estimada: '',
    dificultad: 'facil'
  });

  const columns = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'categoria', header: 'Categoría' },
    { key: 'jugadores_min', header: 'Jugadores Min' },
    { key: 'jugadores_max', header: 'Jugadores Max' },
    { key: 'duracion_estimada', header: 'Duración' },
    { key: 'dificultad', header: 'Dificultad' }
  ];

  useEffect(() => {
    loadJuegos();
  }, []);

  const loadJuegos = async () => {
    try {
      setLoading(true);
      // Datos mock
      const mockJuegos = [
        {
          id: 1,
          nombre: 'Verdad o Reto',
          descripcion: 'Clásico juego de verdad o reto con bebidas',
          instrucciones: 'Los jugadores eligen entre verdad o reto. Si no cumplen, toman.',
          categoria: 'bebida',
          jugadores_min: 3,
          jugadores_max: 10,
          duracion_estimada: '30-60 min',
          dificultad: 'facil'
        },
        {
          id: 2,
          nombre: 'Never Have I Ever',
          descripcion: 'Juego de confesiones con bebidas',
          instrucciones: 'Cada jugador dice algo que nunca ha hecho. Quienes sí lo han hecho, toman.',
          categoria: 'bebida',
          jugadores_min: 4,
          jugadores_max: 12,
          duracion_estimada: '45-90 min',
          dificultad: 'facil'
        },
        {
          id: 3,
          nombre: 'Cóctel Master',
          descripcion: 'Competencia de preparación de cócteles',
          instrucciones: 'Los jugadores compiten preparando cócteles con ingredientes limitados.',
          categoria: 'competencia',
          jugadores_min: 2,
          jugadores_max: 6,
          duracion_estimada: '20-40 min',
          dificultad: 'medio'
        },
        {
          id: 4,
          nombre: 'Bebida Misteriosa',
          descripcion: 'Adivina el cóctel con los ojos vendados',
          instrucciones: 'Los jugadores prueban cócteles vendados y adivinan los ingredientes.',
          categoria: 'adivinanza',
          jugadores_min: 2,
          jugadores_max: 8,
          duracion_estimada: '15-30 min',
          dificultad: 'medio'
        }
      ];
      setJuegos(mockJuegos);
    } catch (error) {
      console.error('Error cargando juegos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingJuego(null);
    setFormData({
      nombre: '',
      descripcion: '',
      instrucciones: '',
      categoria: 'bebida',
      jugadores_min: 2,
      jugadores_max: 8,
      duracion_estimada: '',
      dificultad: 'facil'
    });
    setModalOpen(true);
  };

  const handleEdit = (juego) => {
    setEditingJuego(juego);
    setFormData({
      nombre: juego.nombre,
      descripcion: juego.descripcion,
      instrucciones: juego.instrucciones,
      categoria: juego.categoria,
      jugadores_min: juego.jugadores_min,
      jugadores_max: juego.jugadores_max,
      duracion_estimada: juego.duracion_estimada,
      dificultad: juego.dificultad
    });
    setModalOpen(true);
  };

  const handleDelete = async (juego) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${juego.nombre}"?`)) {
      try {
        setJuegos(juegos.filter(j => j.id !== juego.id));
        alert('Juego eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando juego:', error);
        alert('Error al eliminar el juego');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJuego) {
        const updatedJuego = { ...editingJuego, ...formData };
        setJuegos(juegos.map(j => j.id === editingJuego.id ? updatedJuego : j));
        alert('Juego actualizado exitosamente');
      } else {
        const newJuego = {
          id: Date.now(),
          ...formData
        };
        setJuegos([...juegos, newJuego]);
        alert('Juego creado exitosamente');
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error guardando juego:', error);
      alert('Error al guardar el juego');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="loading">Cargando juegos...</div>;
  }

  return (
    <div className="juegos-page">
      <div className="page-header">
        <h1 className="page-title">Gestión de Juegos</h1>
        <p className="page-subtitle">Administra los juegos de la plataforma</p>
      </div>

      <div className="page-actions">
        <Button variant="success" onClick={handleCreate}>
          ➕ Nuevo Juego
        </Button>
      </div>

      <Table
        columns={columns}
        data={juegos}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingJuego ? 'Editar Juego' : 'Nuevo Juego'}
        size="large"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="bebida">Bebida</option>
                <option value="competencia">Competencia</option>
                <option value="adivinanza">Adivinanza</option>
                <option value="equipo">Equipo</option>
                <option value="individual">Individual</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="form-control"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Instrucciones *</label>
            <textarea
              name="instrucciones"
              value={formData.instrucciones}
              onChange={handleInputChange}
              className="form-control"
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Jugadores Mínimos</label>
              <input
                type="number"
                name="jugadores_min"
                value={formData.jugadores_min}
                onChange={handleInputChange}
                className="form-control"
                min="1"
                max="20"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Jugadores Máximos</label>
              <input
                type="number"
                name="jugadores_max"
                value={formData.jugadores_max}
                onChange={handleInputChange}
                className="form-control"
                min="1"
                max="20"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Duración Estimada</label>
              <input
                type="text"
                name="duracion_estimada"
                value={formData.duracion_estimada}
                onChange={handleInputChange}
                className="form-control"
                placeholder="ej: 30-60 min"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Dificultad</label>
              <select
                name="dificultad"
                value={formData.dificultad}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="facil">Fácil</option>
                <option value="medio">Medio</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="success">
              {editingJuego ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Juegos; 