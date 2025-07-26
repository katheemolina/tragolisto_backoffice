import React from 'react';
import Button from './Button';
import './ConfirmDialog.css';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmar eliminación',
  message = '¿Estás seguro de que quieres eliminar este elemento?',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  itemName = ''
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="confirm-dialog-overlay" onClick={onClose}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog-header">
          <div className="confirm-dialog-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
            </svg>
          </div>
          <h3 className="confirm-dialog-title">{title}</h3>
        </div>
        
        <div className="confirm-dialog-body">
          <p className="confirm-dialog-message">
            {message}
            {itemName && (
              <span className="confirm-dialog-item-name"> "{itemName}"</span>
            )}
          </p>
          <p className="confirm-dialog-warning">
            Esta acción no se puede deshacer.
          </p>
        </div>
        
        <div className="confirm-dialog-actions">
          <Button 
            variant="secondary" 
            onClick={onClose}
            className="confirm-dialog-btn-cancel"
          >
            {cancelText}
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirm}
            className="confirm-dialog-btn-confirm"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 