import React, { useState, useEffect } from 'react';
import Table from '../../components/UI/Table';
import Button, { PlusIcon } from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import { juegosService } from '../../services/api';
import { toast } from 'react-toastify';
import './Juegos.css';

const JUEGOS_POR_PAGINA = 10;

const Juegos = () => {
  const [juegos, setJuegos] = useState([]);
  const [allJuegos, setAllJuegos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewJuego, setViewJuego] = useState(null);
  const [editingJuego, setEditingJuego] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [juegoToDelete, setJuegoToDelete] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    materiales: '',
    min_jugadores: '',
    max_jugadores: '',
    es_para_beber: false
  });

  // Categorías predefinidas para el select
  const categorias = [
    'De preguntas',
    'Musical',
    'Con elementos',
    'De adivinanzas',
    'De comunicación',
    'Creativo',
    'Físico',
    'De reglas',
    'De desafío',
    'Al azar',
    'De cata',
    'Fiesta'
  ];

  useEffect(() => {
    loadJuegos();
  }, []);

  // Efecto separado para aplicar paginación cuando cambia la página
  useEffect(() => {
    if (allJuegos.length > 0) {
      const startIndex = (pagina - 1) * JUEGOS_POR_PAGINA;
      const endIndex = startIndex + JUEGOS_POR_PAGINA;
      const paginatedJuegos = allJuegos.slice(startIndex, endIndex);
      
      console.log(`Aplicando paginación: mostrando juegos ${startIndex + 1} a ${Math.min(endIndex, allJuegos.length)} de ${allJuegos.length}`);
      
      setJuegos(paginatedJuegos);
    }
  }, [pagina, allJuegos]);

  const loadJuegos = async () => {
    try {
      setLoading(true);
      console.log('Cargando todos los juegos...');
      
      const res = await juegosService.getAll();
      console.log('Respuesta de la API:', res.data);
      
      setAllJuegos(res.data);
      setTotal(res.data.length);
    } catch (error) {
      console.error('Error cargando juegos:', error);
      setJuegos([]);
      setAllJuegos([]);
      setTotal(0);
      toast.error('Error al cargar los juegos');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    console.log('Cambiando de página', pagina, 'a', newPage);
    setPagina(newPage);
  };

  const getVisiblePages = () => {
    const totalPaginas = Math.ceil(total / JUEGOS_POR_PAGINA);
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
    setEditingJuego(null);
    setFormData({
      nombre: '',
      descripcion: '',
      categoria: '',
      materiales: '',
      min_jugadores: '',
      max_jugadores: '',
      es_para_beber: false
    });
    setModalOpen(true);
  };

  const handleEdit = (juego) => {
    setEditingJuego(juego);
    setFormData({
      nombre: juego.nombre,
      descripcion: juego.descripcion,
      categoria: juego.categoria,
      materiales: juego.materiales,
      min_jugadores: juego.min_jugadores,
      max_jugadores: juego.max_jugadores || '',
      es_para_beber: juego.es_para_beber === 1
    });
    setModalOpen(true);
  };

  const handleView = (juego) => {
    setViewJuego(juego);
    setViewModalOpen(true);
  };

  const handleDelete = (juego) => {
    setJuegoToDelete(juego);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await juegosService.delete(juegoToDelete.id);
      loadJuegos();
      toast.success('Juego eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar el juego');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        categoria: formData.categoria,
        materiales: formData.materiales,
        min_jugadores: parseInt(formData.min_jugadores),
        max_jugadores: formData.max_jugadores ? parseInt(formData.max_jugadores) : null,
        es_para_beber: formData.es_para_beber
      };

      if (editingJuego) {
        await juegosService.update(editingJuego.id, data);
        toast.success('Juego actualizado exitosamente');
      } else {
        await juegosService.create(data);
        toast.success('Juego creado exitosamente');
      }

      setModalOpen(false);
      loadJuegos();
    } catch (error) {
      console.error('Error:', error);
      toast.error(editingJuego ? 'Error al actualizar el juego' : 'Error al crear el juego');
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
      render: (value, juego) => juego.nombre
    },
    {
      key: 'descripcion',
      header: 'Descripción',
      render: (value, juego) => (
        juego.descripcion?.length > 40 
          ? `${juego.descripcion.slice(0, 40)}...` 
          : juego.descripcion
      )
    },
    {
      key: 'categoria',
      header: 'Categoría',
      render: (value, juego) => juego.categoria
    },
    {
      key: 'materiales',
      header: 'Materiales',
      render: (value, juego) => (
        juego.materiales?.length > 30 
          ? `${juego.materiales.slice(0, 30)}...` 
          : juego.materiales
      )
    },
    {
      key: 'jugadores',
      header: 'Jugadores',
      render: (value, juego) => {
        const min = juego.min_jugadores;
        const max = juego.max_jugadores;
        return max ? `${min}-${max}` : `${min}+`;
      }
    },
    {
      key: 'es_para_beber',
      header: 'Para beber',
      render: (value, juego) => (
        juego.es_para_beber === 1 ? 'Sí' : 'No'
      )
    }
  ];

  const totalPaginas = Math.ceil(total / JUEGOS_POR_PAGINA);

  return (
    <div className="juegos-page">
      <div className="page-header">
        <h1>Gestión de Juegos</h1>
        <p>Administra los juegos de fiesta disponibles</p>
      </div>

      <div className="page-actions">
        <Button variant="success" onClick={handleCreate} icon={<PlusIcon />}>
          Nuevo Juego
        </Button>
      </div>

      <Table
        data={juegos}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
        emptyMessage="No hay juegos disponibles"
      />

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Mostrando {((pagina - 1) * JUEGOS_POR_PAGINA) + 1} - {Math.min(pagina * JUEGOS_POR_PAGINA, total)} de {total} juegos
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

      {/* Modal para crear/editar juego */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingJuego ? 'Editar Juego' : 'Nuevo Juego'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="juego-form">
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
              <label className="form-label">Categoría *</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className="form-control"
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
          </div>

          <div className="form-group">
            <label className="form-label">Descripción *</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="form-control"
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Materiales</label>
            <textarea
              name="materiales"
              value={formData.materiales}
              onChange={handleInputChange}
              className="form-control"
              rows="2"
              placeholder="Ej: Cartas, dados, papel, etc."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mínimo de jugadores *</label>
              <input
                type="number"
                name="min_jugadores"
                value={formData.min_jugadores}
                onChange={handleInputChange}
                className="form-control"
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Máximo de jugadores</label>
              <input
                type="number"
                name="max_jugadores"
                value={formData.max_jugadores}
                onChange={handleInputChange}
                className="form-control"
                min="1"
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">¿Es para beber?</label>
            <input
              type="checkbox"
              name="es_para_beber"
              checked={formData.es_para_beber}
              onChange={handleInputChange}
            />
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

      {/* Modal de ver detalle */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={viewJuego ? `Detalle de ${viewJuego.nombre}` : 'Detalle'}
        size="large"
      >
        {viewJuego && (
          <div className="juego-detalle">
            <div className="juego-detalle-info">
              <h2>{viewJuego.nombre}</h2>
              <p><b>Categoría:</b> {viewJuego.categoria}</p>
              <p><b>Jugadores:</b> {viewJuego.min_jugadores}{viewJuego.max_jugadores ? ` - ${viewJuego.max_jugadores}` : '+'}</p>
              <p><b>¿Es para beber?:</b> {viewJuego.es_para_beber ? 'Sí' : 'No'}</p>
              <p><b>Materiales:</b> {viewJuego.materiales || 'Ninguno'}</p>
              <p><b>Descripción:</b> {viewJuego.descripcion}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Juego"
        message="¿Estás seguro de que quieres eliminar el juego"
        itemName={juegoToDelete?.nombre}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default Juegos; 