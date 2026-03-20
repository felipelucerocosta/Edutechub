// ==============================
// CLASSES VIEW – "Mis Clases"
// Teacher: Create + Join | Student: Join only
// ==============================
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { ClassRoom } from '../types';
import CreateClassModal from './CreateClassModal';
import JoinClassModal   from './JoinClassModal.tsx';
import './ClassesView.css';

const COLOR_ICONS: Record<string, { icon: string; bg: string; glow: string }> = {
  cyan:   { icon: '🤖', bg: 'linear-gradient(135deg,#062240,#0a3060)', glow: '#00d4ff' },
  purple: { icon: '⚡', bg: 'linear-gradient(135deg,#1e0a48,#2d1060)', glow: '#a855f7' },
  blue:   { icon: '💾', bg: 'linear-gradient(135deg,#061848,#0e2860)', glow: '#3b82f6' },
  teal:   { icon: '🔬', bg: 'linear-gradient(135deg,#043030,#0d4848)', glow: '#00ffc8' },
  orange: { icon: '🔧', bg: 'linear-gradient(135deg,#30150a,#48270e)', glow: '#fb923c' },
  pink:   { icon: '📡', bg: 'linear-gradient(135deg,#2a0a30,#440e4a)', glow: '#e879f9' },
};

interface ClassesViewProps {
  onOpenClass: (cls: ClassRoom) => void;
}

export default function ClassesView({ onOpenClass }: ClassesViewProps) {
  const { user, classes } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin,   setShowJoin]   = useState(false);

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  // Classes where this user is a member
  const myClasses = classes.filter(c => c.memberIds.includes(user!.id));

  return (
    <div className="classes-view">
      {/* Header */}
      <div className="cv-header">
        <div>
          <h2 className="cv-title">MIS CLASES</h2>
          <p className="cv-subtitle">Bienvenido/a, {user?.name} 👋</p>
        </div>
        <div className="cv-actions">
          {isTeacher && (
            <button className="btn-create" onClick={() => setShowCreate(true)}>
              + CREAR CLASE
            </button>
          )}
          <button className="btn-join" onClick={() => setShowJoin(true)}>
            🔑 UNIRSE A CLASE
          </button>
        </div>
      </div>

      {/* Grid */}
      {myClasses.length === 0 ? (
        <div className="cv-empty">
          <div className="cv-empty-icon">🎓</div>
          <h3>No tienes clases aún</h3>
          <p>
            {isTeacher
              ? 'Crea una nueva clase o únete a una existente con un código de invitación.'
              : 'Solicita el código de invitación a tu docente y únete a tu primera clase.'}
          </p>
          <div className="cv-empty-actions">
            {isTeacher && <button className="btn-create" onClick={() => setShowCreate(true)}>+ CREAR CLASE</button>}
            <button className="btn-join" onClick={() => setShowJoin(true)}>🔑 UNIRSE A CLASE</button>
          </div>
        </div>
      ) : (
        <div className="cv-grid">
          {myClasses.map(cls => {
            const c = COLOR_ICONS[cls.color] || COLOR_ICONS.cyan;
            return (
              <div
                key={cls.id}
                className="cv-card"
                style={{ background: c.bg, '--glow': c.glow } as React.CSSProperties}
                onClick={() => onOpenClass(cls)}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onOpenClass(cls)}
              >
                <div className="cv-card-shine" />
                <div className="cv-card-header">
                  <span className="cv-card-icon">{c.icon}</span>
                  <span className="cv-card-code">Código: {cls.code}</span>
                </div>
                <h4 className="cv-card-subject">{cls.subject}</h4>
                <p className="cv-card-meta">{cls.course} – División {cls.division}</p>
                <p className="cv-card-teacher">👨‍🏫 {cls.teacherName}</p>
                <div className="cv-card-footer">
                  <span>👥 {cls.memberIds.length}</span>
                  <span className="cv-card-enter">Ir al aula →</span>
                </div>
                <div className="cv-card-glow" style={{ background: c.glow }} />
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showCreate && <CreateClassModal onClose={() => setShowCreate(false)} />}
      {showJoin   && <JoinClassModal onClose={() => setShowJoin(false)} />}
    </div>
  );
}
