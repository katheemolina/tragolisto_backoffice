import React from 'react';
import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import './Table.css';

const Table = ({ columns, data, onEdit, onDelete, onView, loading = false, emptyMessage = "No hay datos para mostrar" }) => {
  if (loading) {
    return (
      <div className="table-container">
        <div className="table-loading">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
            {(onEdit || onDelete || onView) && (
              <th>Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              {(onEdit || onDelete || onView) && (
                <td className="actions-cell">
                  <div className="actions-buttons">
                    {onView && (
                      <button 
                        className="action-btn action-view"
                        onClick={() => onView(row)}
                        title="Ver"
                      >
                        <MdVisibility size={20} />
                      </button>
                    )}
                    {onEdit && (
                      <button 
                        className="action-btn action-edit"
                        onClick={() => onEdit(row)}
                        title="Editar"
                      >
                        <MdEdit size={20} />
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        className="action-btn action-delete"
                        onClick={() => onDelete(row)}
                        title="Eliminar"
                      >
                        <MdDelete size={20} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="table-empty">
          <p>{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Table; 