import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { useProject } from '../Context/ProjectContext';
import './CreateProjectModal.css';

const CreateProjectModal = ({ onClose }) => {
  const { addProject } = useProject();

  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); // ✅ optional
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ESC key support
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);

      // ✅ send description ONLY if provided
      const payload = {
        name: name.trim(),
        ...(description.trim() && { description: description.trim() })
      };

      await addProject(payload);

      setSuccess(true);
      setTimeout(onClose, 1200);
    } catch (err) {
      console.error('Project creation failed:', err);
      alert('Project creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== Header ===== */}
        <div className="modal-header">
          <h3>Create New Project</h3>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* ===== Inputs ===== */}
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* ===== Action / Success ===== */}
        {success ? (
          <div className="modal-success">
            <CheckCircle size={18} />
            Project created successfully
          </div>
        ) : (
          <button
            className="modal-action-btn"
            onClick={handleCreate}
            disabled={loading || !name.trim()}
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            Create
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateProjectModal;
