// ==============================
// CREATE CLASS MODAL – 3-step wizard
// Step 1: Curso + División
// Step 2: Materia
// Step 3: Validate (no duplicate) → confirm
// ==============================
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Modal.css';

const COURSES = ['1er Año','2do Año','3er Año','4to Año','5to Año','6to Año'];
const DIVISIONS = ['A','B','C','D','E','F'];
const SUBJECTS = [
  'Matemáticas','Física','Química','Biología','Lenguaje',
  'Historia','Geografía','Inglés','Informática','Robótica Avanzada',
  'Microcontroladores','Circuitos Digitales','Base de Datos Técnicas',
  'Electrónica','Programación','Redes y Comunicaciones',
];

interface Props { onClose: () => void; }

export default function CreateClassModal({ onClose }: Props) {
  const { createClass } = useApp();
  const [step, setStep]       = useState(1);
  const [course, setCourse]   = useState('');
  const [division, setDiv]    = useState('');
  const [subject, setSubject] = useState('');
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const nextStep = () => {
    if (step === 1 && (!course || !division)) { setError('Selecciona el curso y la división.'); return; }
    if (step === 2 && !subject) { setError('Selecciona la materia.'); return; }
    setError('');
    setStep(s => s + 1);
  };

  const handleCreate = () => {
    const result = createClass({ course, division, subject });
    if (!result.ok) { setError(result.reason || 'Error al crear la clase.'); setStep(3); return; }
    setSuccess('✅ Clase creada exitosamente.');
    setTimeout(onClose, 1800);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* Steps indicator */}
        <div className="modal-steps">
          {['Curso & División','Materia','Confirmar'].map((label, i) => (
            <div key={i} className={`modal-step ${step === i+1 ? 'modal-step--active' : ''} ${step > i+1 ? 'modal-step--done' : ''}`}>
              <span className="step-num">{step > i+1 ? '✓' : i+1}</span>
              <span className="step-label">{label}</span>
            </div>
          ))}
        </div>

        <h3 className="modal-title">
          {step === 1 && '📋 Selecciona el Curso y División'}
          {step === 2 && '📚 Selecciona la Materia'}
          {step === 3 && '✅ Confirmar Clase'}
        </h3>

        {/* Step 1 */}
        {step === 1 && (
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Curso</label>
              <div className="option-grid">
                {COURSES.map(c => (
                  <button key={c} className={`option-chip ${course===c?'option-chip--active':''}`} onClick={() => setCourse(c)}>{c}</button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">División</label>
              <div className="option-grid option-grid--div">
                {DIVISIONS.map(d => (
                  <button key={d} className={`option-chip ${division===d?'option-chip--active':''}`} onClick={() => setDiv(d)}>{d}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Materia</label>
              <div className="subject-list">
                {SUBJECTS.map(s => (
                  <button key={s} className={`subject-item ${subject===s?'subject-item--active':''}`} onClick={() => setSubject(s)}>
                    {subject===s ? '✓ ' : ''}{s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 – Confirm */}
        {step === 3 && !success && (
          <div className="modal-body">
            <div className="confirm-card">
              <div className="confirm-row"><span>Curso:</span><strong>{course}</strong></div>
              <div className="confirm-row"><span>División:</span><strong>{division}</strong></div>
              <div className="confirm-row"><span>Materia:</span><strong>{subject}</strong></div>
            </div>
            <p className="confirm-info">Se generará un código de invitación único para que los estudiantes puedan unirse.</p>
          </div>
        )}

        {success && <div className="modal-success">{success}</div>}

        {error && <p className="modal-error">{error}</p>}

        {!success && (
          <div className="modal-footer">
            <button className="btn-modal-cancel" onClick={step === 1 ? onClose : () => setStep(s=>s-1)}>
              {step === 1 ? 'Cancelar' : '← Atrás'}
            </button>
            {step < 3
              ? <button className="btn-modal-next" onClick={nextStep}>Siguiente →</button>
              : <button className="btn-modal-create" onClick={handleCreate}>Crear Clase</button>
            }
          </div>
        )}
      </div>
    </div>
  );
}
