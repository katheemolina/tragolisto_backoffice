import React, { useState, useEffect } from 'react';
import './SearchFilter.css';

const SearchFilter = ({ 
  data, 
  onFilteredDataChange, 
  searchFields = [], 
  placeholder = "Buscar...",
  showFilters = true,
  filterOptions = {}
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    filterData();
  }, [searchTerm, activeFilters, data]);

  const filterData = () => {
    let filteredData = [...data];

    // Función helper para normalizar valores de dificultad
    const normalizeDifficulty = (value) => {
      if (!value) return '';
      const str = String(value).trim().toLowerCase();
      if (str.includes('muy facil') || str.includes('muy fácil')) return 'muy facil';
      if (str.includes('facil') || str.includes('fácil')) return 'facil';
      if (str.includes('medio') || str.includes('media')) return 'media';
      if (str.includes('dificil') || str.includes('difícil')) return 'dificil';
      return str;
    };

    // Aplicar búsqueda por texto
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => {
        return searchFields.some(field => {
          const value = item[field];
          if (value === null || value === undefined) return false;
          return value.toString().toLowerCase().includes(searchLower);
        });
      });
    }

    // Aplicar filtros
    Object.keys(activeFilters).forEach(filterKey => {
      const filterValue = activeFilters[filterKey];
      if (filterValue && filterValue !== 'todos') {

        
        filteredData = filteredData.filter(item => {
          const itemValue = item[filterKey];
          
          // Manejar valores null/undefined
          if (itemValue === null || itemValue === undefined) {
            return false;
          }
          
          // Normalizar valores de dificultad
          if (filterKey === 'dificultad') {
            const normalizedItemValue = normalizeDifficulty(itemValue);
            const normalizedFilterValue = normalizeDifficulty(filterValue);
            

            
            return normalizedItemValue === normalizedFilterValue;
          }
          
          // Para otros campos, convertir ambos valores a string para comparación
          const itemValueStr = String(itemValue).trim().toLowerCase();
          const filterValueStr = String(filterValue).trim().toLowerCase();
          
          return itemValueStr === filterValueStr;
        });
      }
    });

    onFilteredDataChange(filteredData);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveFilters({});
  };

  const hasActiveFilters = searchTerm.trim() || Object.values(activeFilters).some(value => value && value !== 'todos');

  return (
    <div className="search-filter-container">
      <div className="search-section">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="clear-filters-btn"
            title="Limpiar filtros"
          >
            ✕
          </button>
        )}
      </div>

      {showFilters && Object.keys(filterOptions).length > 0 && (
        <div className="filters-section">
          {Object.entries(filterOptions).map(([filterKey, options]) => (
            <div key={filterKey} className="filter-group">
              <select
                value={activeFilters[filterKey] || 'todos'}
                onChange={(e) => handleFilterChange(filterKey, e.target.value)}
                className="filter-select"
              >
                <option value="todos">
                  {options.label || `Todos los ${filterKey}`}
                </option>
                {options.values.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchFilter; 