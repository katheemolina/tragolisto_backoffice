import React, { useState, useEffect } from 'react';
import Button from '../../components/UI/Button';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import { ingredientesService } from '../../services/api';
import './Ingredientes.css';

const Ingredientes = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIngrediente, setEditingIngrediente] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: 'licor',
    disponibilidad: true,
    precio_estimado: ''
  });

  const columns = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'categoria', header: 'Categoría' },
    { key: 'disponibilidad', header: 'Disponible', render: (value) => value ? '✅ Sí' : '❌ No' },
    { key: 'precio_estimado', header: 'Precio Estimado' }
  ];

  useEffect(() => {
    loadIngredientes();
  }, []);

  const loadIngredientes = async () => {
    try {
      setLoading(true);
      // Datos mock
      const mockIngredientes = [
        {
          id: 1,
          nombre: 'Ron Blanco',
          descripcion: 'Ron blanco premium para cócteles',
          categoria: 'licor',
          disponibilidad: true,
          precio_estimado: '$25.000'
        },
        {
          id: 2,
          nombre: 'Tequila',
          descripcion: 'Tequila reposado mexicano',
          categoria: 'licor',
          disponibilidad: true,
          precio_estimado: '$35.000'
        },
        {
          id: 3,
          nombre: 'Limón',
          descripcion: 'Limón fresco para cócteles',
          categoria: 'fruta',
          disponibilidad: true,
          precio_estimado: '$2.000'
        },
        {
          id: 4,
          nombre: 'Menta',
          descripcion: 'Hojas de menta fresca',
          categoria: 'hierba',
          disponibilidad: false,
          precio_estimado: '$1.500'
        }
      ];
      setIngredientes(mockIngredientes);
    } catch (error) {
      console.error('Error cargando ingredientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingIngrediente(null);
    setFormData({
      nombre: '',
      descripcion: '',
      categoria: 'licor',
      disponibilidad: true,
      precio_estimado: ''
    });
    setModalOpen(true);
  };

  const handleEdit = (ingrediente) => {
    setEditingIngrediente(ingrediente);
    setFormData({
      nombre: ingrediente.nombre,
      descripcion: ingrediente.descripcion,
      categoria: ingrediente.categoria,
      disponibilidad: ingrediente.disponibilidad,
      precio_estimado: ingrediente.precio_estimado
    });
    setModalOpen(true);
  };

  const handleDelete = async (ingrediente) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${ingrediente.nombre}"?`)) {
      try {
        setIngredientes(ingredientes.filter(i => i.id !== ingrediente.id));
        alert('Ingrediente eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando ingrediente:', error);
        alert('Error al eliminar el ingrediente');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIngrediente) {
        const updatedIngrediente = { ...editingIngrediente, ...formData };
        setIngredientes(ingredientes.map(i => i.id === editingIngrediente.id ? updatedIngrediente : i));
        alert('Ingrediente actualizado exitosamente');
      } else {
        const newIngrediente = {
          id: Date.now(),
          ...formData
        };
        setIngredientes([...ingredientes, newIngrediente]);
        alert('Ingrediente creado exitosamente');
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error guardando ingrediente:', error);
      alert('Error al guardar el ingrediente');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return <div className="loading">Cargando ingredientes...</div>;
  }

  return (
    <div className="ingredientes-page">
      <div className="page-header">
        <h1 className="page-title">Gestión de Ingredientes</h1>
        <p className="page-subtitle">Administra los ingredientes disponibles</p>
      </div>

      <div className="page-actions">
        <Button variant="success" onClick={handleCreate}>
          ➕ Nuevo Ingrediente
        </Button>
      </div>

      <Table
        columns={columns}
        data={ingredientes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingIngrediente ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
      >
        <form onSubmit={handleSubmit}>
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
            <label className="form-label">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="form-control"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="licor">Licor</option>
                <option value="fruta">Fruta</option>
                <option value="hierba">Hierba</option>
                <option value="especia">Especia</option>
                <option value="dulce">Dulce</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Precio Estimado</label>
              <input
                type="text"
                name="precio_estimado"
                value={formData.precio_estimado}
                onChange={handleInputChange}
                className="form-control"
                placeholder="$0"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-checkbox">
              <input
                type="checkbox"
                name="disponibilidad"
                checked={formData.disponibilidad}
                onChange={handleInputChange}
              />
              <span>Disponible</span>
            </label>
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="success">
              {editingIngrediente ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Ingredientes; 