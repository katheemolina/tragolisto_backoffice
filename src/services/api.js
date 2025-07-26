import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Configuración base de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Servicios para Tragos
export const tragosService = {
  getAll: (params = {}) => api.get('/tragos/', { params }),
  getById: (id) => api.get(`/tragos/${id}`),
  create: (data) => api.post('/tragos/', data),
  update: (id, data) => api.put(`/tragos/${id}`, data),
  delete: (id) => api.delete(`/tragos/${id}`),
  getTopFavoritos: () => api.get('/tragos/top-favoritos'),
};

// Servicios para Ingredientes
export const ingredientesService = {
  getAll: () => api.get('/ingredientes/'),
  getById: (id) => api.get(`/ingredientes/${id}`),
  create: (data) => api.post('/ingredientes/', data),
  update: (id, data) => api.put(`/ingredientes/${id}`, data),
  delete: (id) => api.delete(`/ingredientes/${id}`),
};

// Servicios para Juegos (modo fiesta)
export const juegosService = {
  getAll: () => api.get('/modofiesta/'),
  getById: (id) => api.get(`/modofiesta/${id}`),
  create: (data) => api.post('/modofiesta/', data),
  update: (id, data) => api.put(`/modofiesta/${id}`, data),
  delete: (id) => api.delete(`/modofiesta/${id}`),
};

// Servicios para Usuarios
export const usuariosService = {
  getAll: () => api.get('/usuarios'),
};

// Dashboard helpers (usando los endpoints disponibles)
export const dashboardService = {
  getTopTragos: () => api.get('/toptragos'),
  getIndicadores: () => api.get('/indicadores'),
  getTragos: () => api.get('/tragos/'),
  getIngredientes: () => api.get('/ingredientes/'),
  getJuegos: () => api.get('/modofiesta/'),
};

export default api; 