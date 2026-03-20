// ==============================
// JOIN CLASS MODAL
// ==============================
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Modal.css';

interface Props { onClose: () => void; }

export default function JoinClassModal({ onClose }: Props) {
  const { joinClass } = useApp();
  const [code, setCode]     = useState('');
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');

  const handle = () => {
    if (!code.trim()) { setError('Ingresa el código de invitación.'); return; }
    const result = joinClass(code);
    if (!result.ok) { setError(result.reason || 'Error.'); return; }
    setSuccess('✅ ¡Te has unido a la clase exitosamente!');
    setTimeout(onClose, 1800);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box modal-box--sm">
        <h3 className="modal-title">🔑 Unirse a una Clase</h3>
        <p className="modal-desc">Ingresa el código de invitación que te proporcionó tu docente.</p>

        {!success ? (
          <>
            <div className="join-code-input-wrap">
              <input
                className="join-code-input"
                placeholder="Ej: ABC123"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handle()}
                maxLength={8}
              />
            </div>
            {error && <p className="modal-error">{error}</p>}
            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={onClose}>Cancelar</button>
              <button className="btn-modal-create" onClick={handle}>Unirse</button>
            </div>
          </>
        ) : (
          <div className="modal-success">{success}</div>
        )}
      </div>
    </div>
  );
}
