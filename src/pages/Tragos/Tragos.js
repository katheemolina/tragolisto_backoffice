import React, { useState, useEffect } from 'react';
import Button, { PlusIcon } from '../../components/UI/Button';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import SearchFilter from '../../components/UI/SearchFilter';
import { tragosService } from '../../services/api';
import './Tragos.css';
import { toast } from 'react-toastify';


  const TRAGOS_POR_PAGINA = 10;

const Tragos = () => {
  const [tragos, setTragos] = useState([]);
  const [allTragos, setAllTragos] = useState([]); // Para almacenar todos los tragos
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewTrago, setViewTrago] = useState(null);
  const [editingTrago, setEditingTrago] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [tragoToDelete, setTragoToDelete] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    instrucciones: '',
    tips: '',
    historia: '',
    es_alcoholico: 1,
    dificultad: '',
    tiempo_preparacion_minutos: '',
    imagen_url: ''
  });
  const [pagina, setPagina] = useState(1);
  const [filteredTragos, setFilteredTragos] = useState([]);

  // Opciones de dificultad para el formulario
  const dificultadOptions = [
    { value: 'muy facil', label: 'Muy Fácil' },
    { value: 'facil', label: 'Fácil' },
    { value: 'media', label: 'Media' },
    { value: 'dificil', label: 'Difícil' }
  ];

  // Configuración de filtros para tragos
  const filterOptions = {
    es_alcoholico: {
      label: 'Tipo de bebida',
      values: [
        { value: 1, label: 'Alcohólico' },
        { value: 0, label: 'Sin alcohol' }
      ]
    },
    dificultad: {
      label: 'Dificultad',
      values: [
        { value: 'muy facil', label: 'Muy Fácil' },
        { value: 'facil', label: 'Fácil' },
        { value: 'media', label: 'Media' },
        { value: 'dificil', label: 'Difícil' }
      ]
    }
  };

  const columns = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'dificultad', header: 'Dificultad' },
    { key: 'tiempo_preparacion_minutos', header: 'Tiempo (min)' },
    { key: 'es_alcoholico', header: '¿Alc.?', render: v => v ? 'Sí' : 'No' },
    { key: 'descripcion', header: 'Descripción', render: v => v?.slice(0, 40) + (v?.length > 40 ? '...' : '') },
  ];

  useEffect(() => {
    loadTragos();
    // eslint-disable-next-line
  }, []);

  // Efecto para inicializar los datos filtrados cuando se cargan los datos
  useEffect(() => {
    setFilteredTragos(allTragos);
    setPagina(1); // Resetear a la primera página cuando cambian los datos
  }, [allTragos]);

  // Efecto separado para aplicar paginación cuando cambia la página
  useEffect(() => {
    if (filteredTragos.length > 0) {
      const startIndex = (pagina - 1) * TRAGOS_POR_PAGINA;
      const endIndex = startIndex + TRAGOS_POR_PAGINA;
      const paginatedTragos = filteredTragos.slice(startIndex, endIndex);
      
      console.log(`Aplicando paginación: mostrando tragos ${startIndex + 1} a ${Math.min(endIndex, filteredTragos.length)} de ${filteredTragos.length}`);
      
      setTragos(paginatedTragos);
    } else {
      setTragos([]);
    }
  }, [pagina, filteredTragos]);

  const loadTragos = async () => {
    try {
      setLoading(true);
      console.log('Cargando todos los tragos...');
      
      const res = await tragosService.getAll();
      const data = res.data;
      console.log('Respuesta de la API:', data);
      

      
      setAllTragos(data.tragos);
      setTotal(data.total);
    } catch (error) {
      console.error('Error cargando tragos:', error);
      setTragos([]);
      setAllTragos([]);
      setTotal(0);
      toast.error('Error al cargar los tragos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTrago(null);
    setFormData({
      nombre: '',
      descripcion: '',
      instrucciones: '',
      tips: '',
      historia: '',
      es_alcoholico: 1,
      dificultad: '',
      tiempo_preparacion_minutos: '',
      imagen_url: ''
    });
    setModalOpen(true);
  };

  const handleEdit = (trago) => {
    setEditingTrago(trago);
    setFormData({
      nombre: trago.nombre,
      descripcion: trago.descripcion,
      instrucciones: trago.instrucciones,
      tips: trago.tips,
      historia: trago.historia,
      es_alcoholico: trago.es_alcoholico,
      dificultad: trago.dificultad,
      tiempo_preparacion_minutos: trago.tiempo_preparacion_minutos,
      imagen_url: trago.imagen_url || ''
    });
    setModalOpen(true);
  };

  const handleDelete = (trago) => {
    setTragoToDelete(trago);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await tragosService.delete(tragoToDelete.id);
      loadTragos();
      toast.success('Trago eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar el trago');
    }
  };

  const handleView = (trago) => {
    setViewTrago(trago);
    setViewModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTrago) {
        await tragosService.update(editingTrago.id, formData);
        toast.success('Trago actualizado exitosamente');
      } else {
        await tragosService.create(formData);
        toast.success('Trago creado exitosamente');
      }
      setModalOpen(false);
      loadTragos();
    } catch (error) {
      toast.error('Error al guardar el trago');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  // Paginación
  const totalPaginas = Math.ceil(filteredTragos.length / TRAGOS_POR_PAGINA);
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  const handlePageChange = (newPage) => {
    console.log('Cambiando de página', pagina, 'a', newPage);
    if (newPage >= 1 && newPage <= totalPaginas) {
      setPagina(newPage);
    }
  };

  const getVisiblePages = () => {
    const delta = 2; // Número de páginas a mostrar antes y después de la actual
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, pagina - delta); i <= Math.min(totalPaginas - 1, pagina + delta); i++) {
      range.push(i);
    }

    if (pagina - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (pagina + delta < totalPaginas - 1) {
      rangeWithDots.push('...', totalPaginas);
    } else if (totalPaginas > 1) {
      rangeWithDots.push(totalPaginas);
    }

    return rangeWithDots;
  };

  if (loading) {
    return <div className="loading">Cargando tragos...</div>;
  }

  return (
    <div className="tragos-page">
      <div className="page-header">
        <h1 className="page-title">Gestión de Tragos</h1>
        <p className="page-subtitle">Administra los tragos de la plataforma</p>
      </div>

      <div className="page-actions">
        <Button variant="success" onClick={handleCreate} icon={<PlusIcon />}>
           Nuevo Trago
        </Button>
      </div>

      <SearchFilter
        data={allTragos}
        onFilteredDataChange={setFilteredTragos}
        searchFields={['nombre', 'descripcion', 'instrucciones']}
        placeholder="Buscar tragos por nombre, descripción o instrucciones..."
        filterOptions={filterOptions}
      />

      <Table
        columns={columns}
        data={tragos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {totalPaginas > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Mostrando {((pagina - 1) * TRAGOS_POR_PAGINA) + 1} - {Math.min(pagina * TRAGOS_POR_PAGINA, filteredTragos.length)} de {filteredTragos.length} tragos
          </div>
          <div className="pagination">
          <button
            className="pagination-btn pagination-nav"
            onClick={() => handlePageChange(pagina - 1)}
            disabled={pagina === 1}
            title="Página anterior"
          >
            ←
          </button>
          
          {getVisiblePages().map((page, index) => (
            <button
              key={index}
              className={`pagination-btn${page === pagina ? ' active' : ''}${page === '...' ? ' pagination-dots' : ''}`}
              onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
              disabled={page === pagina || page === '...'}
            >
              {page}
            </button>
          ))}
          
          <button
            className="pagination-btn pagination-nav"
            onClick={() => handlePageChange(pagina + 1)}
            disabled={pagina === totalPaginas}
            title="Página siguiente"
          >
            →
          </button>
        </div>
        </div>
      )}

      {/* Modal de ver detalle */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={viewTrago ? `Detalle de ${viewTrago.nombre}` : 'Detalle'}
        size="large"
      >
        {viewTrago && (
          <div className="trago-detalle">
            {viewTrago.imagen_url && (
              <div className="trago-detalle-img">
                <img src={viewTrago.imagen_url} alt={viewTrago.nombre} />
              </div>
            )}
            <div className="trago-detalle-info">
              <h2>{viewTrago.nombre}</h2>
              <p><b>Dificultad:</b> {viewTrago.dificultad}</p>
              <p><b>Tiempo de preparación:</b> {viewTrago.tiempo_preparacion_minutos} min</p>
              <p><b>¿Alcohólico?:</b> {viewTrago.es_alcoholico ? 'Sí' : 'No'}</p>
              <p><b>Descripción:</b> {viewTrago.descripcion}</p>
              <p><b>Instrucciones:</b> {viewTrago.instrucciones}</p>
              <p><b>Tips:</b> {viewTrago.tips}</p>
              <p><b>Historia:</b> {viewTrago.historia}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTrago ? 'Editar Trago' : 'Nuevo Trago'}
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
              <label className="form-label">Dificultad</label>
              <select
                name="dificultad"
                value={formData.dificultad}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Selecciona la dificultad</option>
                {dificultadOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tiempo de Preparación (min)</label>
              <input
                type="number"
                name="tiempo_preparacion_minutos"
                value={formData.tiempo_preparacion_minutos}
                onChange={handleInputChange}
                className="form-control"
                min="1"
              />
            </div>
            <div className="form-group">
              <label className="form-label">¿Es alcohólico?</label>
              <input
                type="checkbox"
                name="es_alcoholico"
                checked={!!formData.es_alcoholico}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="form-control"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Instrucciones</label>
            <textarea
              name="instrucciones"
              value={formData.instrucciones}
              onChange={handleInputChange}
              className="form-control"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tips</label>
            <textarea
              name="tips"
              value={formData.tips}
              onChange={handleInputChange}
              className="form-control"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Historia</label>
            <textarea
              name="historia"
              value={formData.historia}
              onChange={handleInputChange}
              className="form-control"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL Imagen</label>
            <input
              type="text"
              name="imagen_url"
              value={formData.imagen_url}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="success">
              {editingTrago ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Trago"
        message="¿Estás seguro de que quieres eliminar el trago"
        itemName={tragoToDelete?.nombre}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default Tragos; 