import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import Table from '../../components/UI/Table';
import Button, { PlusIcon } from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import { ingredientesService } from '../../services/api';
import { toast } from 'react-toastify';
import './Ingredientes.css';

const INGREDIENTES_POR_PAGINA = 10;

const Ingredientes = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [allIngredientes, setAllIngredientes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIngrediente, setEditingIngrediente] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [ingredienteToDelete, setIngredienteToDelete] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    es_alcohol: false,
    categoria: ''
  });

  // Categorías predefinidas para el select
  const categorias = [
    'Alcohol Base',
    'Aperitivo',
    'Licor',
    'Amargo',
    'Jugo de Fruta',
    'Fruta Cítrica',
    'Fruta',
    'Hierba Aromática',
    'Vegetal',
    'Gaseosa/Soda',
    'Agua',
    'Endulzante',
    'Jarabes',
    'Adicional',
    'Especias/Condimentos',
    'Lácteo',
    'Lácteo/Fruta',
    'Condimento',
    'Bebida'
  ];

  useEffect(() => {
    loadIngredientes();
  }, []);

  // Efecto separado para aplicar paginación cuando cambia la página
  useEffect(() => {
    if (allIngredientes.length > 0) {
      const startIndex = (pagina - 1) * INGREDIENTES_POR_PAGINA;
      const endIndex = startIndex + INGREDIENTES_POR_PAGINA;
      const paginatedIngredientes = allIngredientes.slice(startIndex, endIndex);
      
      console.log(`Aplicando paginación: mostrando ingredientes ${startIndex + 1} a ${Math.min(endIndex, allIngredientes.length)} de ${allIngredientes.length}`);
      
      setIngredientes(paginatedIngredientes);
    }
  }, [pagina, allIngredientes]);

  const loadIngredientes = async () => {
    try {
      setLoading(true);
      console.log('Cargando todos los ingredientes...');
      
      const res = await ingredientesService.getAll();
      console.log('Respuesta de la API:', res.data);
      
      setAllIngredientes(res.data);
      setTotal(res.data.length);
    } catch (error) {
      console.error('Error cargando ingredientes:', error);
      setIngredientes([]);
      setAllIngredientes([]);
      setTotal(0);
      toast.error('Error al cargar los ingredientes');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    console.log('Cambiando de página', pagina, 'a', newPage);
    setPagina(newPage);
  };

  const getVisiblePages = () => {
    const totalPaginas = Math.ceil(total / INGREDIENTES_POR_PAGINA);
    const current = pagina;
    const pages = [];
    
    if (totalPaginas <= 7) {
      for (let i = 1; i <= totalPaginas; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPaginas);
      } else if (current >= totalPaginas - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPaginas - 4; i <= totalPaginas; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPaginas);
      }
    }
    
    return pages;
  };

  const handleCreate = () => {
    setEditingIngrediente(null);
    setFormData({
      nombre: '',
      es_alcohol: false,
      categoria: ''
    });
    setModalOpen(true);
  };

  const handleEdit = (ingrediente) => {
    setEditingIngrediente(ingrediente);
    setFormData({
      nombre: ingrediente.nombre,
      es_alcohol: ingrediente.es_alcohol === 1,
      categoria: ingrediente.categoria
    });
    setModalOpen(true);
  };

  const handleDelete = (ingrediente) => {
    setIngredienteToDelete(ingrediente);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await ingredientesService.delete(ingredienteToDelete.id);
      loadIngredientes();
      toast.success('Ingrediente eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar el ingrediente');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        nombre: formData.nombre,
        es_alcohol: formData.es_alcohol,
        categoria: formData.categoria
      };

      if (editingIngrediente) {
        await ingredientesService.update(editingIngrediente.id, data);
        toast.success('Ingrediente actualizado exitosamente');
      } else {
        await ingredientesService.create(data);
        toast.success('Ingrediente creado exitosamente');
      }

      setModalOpen(false);
      loadIngredientes();
    } catch (error) {
      console.error('Error:', error);
      toast.error(editingIngrediente ? 'Error al actualizar el ingrediente' : 'Error al crear el ingrediente');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const columns = [
    {
      key: 'nombre',
      header: 'Nombre',
      render: (value, ingrediente) => ingrediente.nombre
    },
    {
      key: 'categoria',
      header: 'Categoría',
      render: (value, ingrediente) => ingrediente.categoria
    },
    {
      key: 'es_alcohol',
      header: 'Tipo',
      render: (value, ingrediente) => (
        ingrediente.es_alcohol === 1 ? 'Alcohólico' : 'Sin Alcohol'
      )
    }
  ];

  const totalPaginas = Math.ceil(total / INGREDIENTES_POR_PAGINA);

  return (
    <div className="ingredientes-page">
      <div className="page-header">
        <h1>Gestión de Ingredientes</h1>
        <p>Administra los ingredientes disponibles para los tragos</p>
      </div>

      <div className="page-actions">
        <Button variant="success" onClick={handleCreate} icon={<PlusIcon />}>
          Nuevo Ingrediente
        </Button>
      </div>

      <Table
        data={ingredientes}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No hay ingredientes disponibles"
      />

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Mostrando {((pagina - 1) * INGREDIENTES_POR_PAGINA) + 1} - {Math.min(pagina * INGREDIENTES_POR_PAGINA, total)} de {total} ingredientes
          </div>
          <div className="pagination">
            <button
              className="pagination-btn pagination-nav"
              onClick={() => handlePageChange(pagina - 1)}
              disabled={pagina === 1}
            >
              ←
            </button>
            
            {getVisiblePages().map((page, index) => (
              <button
                key={index}
                className={`pagination-btn ${page === pagina ? 'active' : ''} ${page === '...' ? 'pagination-dots' : ''}`}
                onClick={() => page !== '...' && handlePageChange(page)}
                disabled={page === '...'}
              >
                {page}
              </button>
            ))}
            
            <button
              className="pagination-btn pagination-nav"
              onClick={() => handlePageChange(pagina + 1)}
              disabled={pagina === totalPaginas}
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* Modal para crear/editar ingrediente */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingIngrediente ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
      >
        <form onSubmit={handleSubmit} className="ingrediente-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Ingrediente *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              placeholder="Ej: Vodka, Jugo de Limón, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoría *</label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">¿Es alcohólico?</label>
            <input
              type="checkbox"
              name="es_alcohol"
              checked={formData.es_alcohol}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="success">
              {editingIngrediente ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Ingrediente"
        message="¿Estás seguro de que quieres eliminar el ingrediente"
        itemName={ingredienteToDelete?.nombre}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default Ingredientes; 