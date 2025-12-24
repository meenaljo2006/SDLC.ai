import React, { useEffect, useState } from 'react';
import { X, AlertTriangle, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import './DeleteProjectModal.css';

const DeleteProjectModal = ({ project, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!project) return null;

  // Handle the delete flow
  const handleDeleteClick = async () => {
    try {
      setIsDeleting(true);
      
      // 1. Call the API function passed from parent
      await onConfirm(project.id);
      
      // 2. Show Success State
      setIsDeleting(false);
      setIsSuccess(true);

      // 3. Wait 1.5 seconds, then close
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error("Delete failed in modal", error);
      setIsDeleting(false);
      // Optional: You could show an error state here
      onClose(); 
    }
  };

  // Close on ESC key (only if not currently deleting)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && !isDeleting && !isSuccess) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, isDeleting, isSuccess]);

  return (
    <div className="modal-backdrop">
      <div 
        className="modal-box delete-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* === SUCCESS VIEW === */}
        {isSuccess ? (
          <div className="modal-success-content">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={48} className="success-icon-animate" />
            </div>
            <h3>Deleted Successfully</h3>
          </div>
        ) : (
          /* === CONFIRM VIEW === */
          <>
            <div className="modal-deleteheader">
              <div className="header-title-danger">
                <div className="danger-icon-bg">
                  <AlertTriangle size={20} />
                </div>
                <h3>Delete Project ?</h3>
              </div>
            </div>

            <div className="modal-deletebody">
              <p>
                Are you sure you want to delete <strong className="text-white">{project.name}</strong>?
              </p>
              <p className="sub-text">
                This action creates a permanent removal of all history and logs. This cannot be undone.
              </p>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-cancel" 
                onClick={onClose}
                disabled={isDeleting}
              >
                Cancel
              </button>
              
              <button 
                className="btn-delete-confirm" 
                onClick={handleDeleteClick}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
                <span>{isDeleting ? "Deleting..." : "Delete Forever"}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteProjectModal;