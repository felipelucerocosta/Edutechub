// ==============================
// NAVBAR – Edu-Tech
// ==============================
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { ClassRoom } from '../types';
import './Navbar.css';

interface NavbarProps {
  activeClass: ClassRoom | null;
  onGoHome: () => void;
  onLogout: () => void;
}

export default function Navbar({ activeClass, onGoHome, onLogout }: NavbarProps) {
  const { user } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);

  return (
    <header className="navbar">
      {/* Left: Logo + breadcrumb */}
      <div className="navbar-left">
        <button className="navbar-brand" onClick={onGoHome} title="Ir a Mis Clases">
          <div className="navbar-logo">T</div>
          <span className="navbar-name">Edu-Tech</span>
        </button>

        {activeClass && (
          <>
            <span className="navbar-sep">›</span>
            <span className="navbar-breadcrumb">
              {activeClass.subject}
              <span className="navbar-breadcrumb-sub">{activeClass.course} – Div. {activeClass.division}</span>
            </span>
          </>
        )}
      </div>

      {/* Center: nav links (only when no active class) */}
      {!activeClass && (
        <nav className="navbar-links">
          <button className="navbar-link navbar-link--active">
            <span>📚</span> Mis Clases
          </button>
        </nav>
      )}

      {/* Right: actions */}
      <div className="navbar-actions">
        {/* Notifications */}
        <div className="navbar-drop-wrap">
          <button className="navbar-icon-btn" onClick={() => { setNotifOpen(p=>!p); setProfileOpen(false); }}>
            🔔<span className="navbar-badge">2</span>
          </button>
          {notifOpen && (
            <div className="navbar-dropdown">
              <p className="dd-title">Notificaciones</p>
              <div className="dd-item">📝 Nueva tarea publicada</div>
              <div className="dd-item">💬 Comentario en el Foro</div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="navbar-drop-wrap">
          <button className="navbar-profile-btn" onClick={() => { setProfileOpen(p=>!p); setNotifOpen(false); }}>
            <div className="navbar-avatar">{user?.avatar}</div>
            <span className="navbar-profile-label">
              {user?.name.split(' ')[0]} ▾
            </span>
          </button>
          {profileOpen && (
            <div className="navbar-dropdown navbar-dropdown--right">
              <p className="dd-title">{user?.name}</p>
              <div className="dd-item">
                <span className={`role-badge role-badge--${user?.role}`}>
                  {user?.role === 'teacher' ? 'Docente' : user?.role === 'student' ? 'Estudiante' : 'Admin'}
                </span>
              </div>
              <div className="dd-divider" />
              <div className="dd-item">⚙️ Configuración</div>
              <div className="dd-divider" />
              <button className="dd-logout" onClick={onLogout}>🚪 Cerrar sesión</button>
            </div>
          )}
        </div>

        <button className="navbar-icon-btn" aria-label="Ajustes">⚙️</button>
      </div>
    </header>
  );
}
