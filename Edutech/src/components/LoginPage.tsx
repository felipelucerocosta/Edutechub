// ==============================
// LOGIN PAGE – Edu-Tech
// ==============================
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types';
import './LoginPage.css';

interface LoginPageProps {
  onLogin: () => void;
}

type Tab = 'ESTUDIANTE' | 'DOCENTE' | 'ADMIN';

const ROLE_MAP: Record<Tab, UserRole> = {
  ESTUDIANTE: 'student',
  DOCENTE: 'teacher',
  ADMIN: 'admin',
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const { login } = useApp();
  const [tab, setTab]     = useState<Tab>('ESTUDIANTE');
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(ROLE_MAP[tab]);
    onLogin();
  };

  return (
    <div className="login-wrapper">
      <div className="login-blob login-blob--1" />
      <div className="login-blob login-blob--2" />

      <div className="login-container">
        {/* Branding */}
        <div className="login-brand">
          <div className="brand-logo"><span className="brand-logo-letter">T</span></div>
          <h1 className="brand-title">Edu-Tech</h1>
          <p className="brand-subtitle">Plataforma Técnica</p>
          <p className="brand-desc">Tu Portal al Futuro Técnico.<br />Accede a cursos, proyectos y herramientas.</p>
          <div className="brand-features">
            {[['🎓','Cursos interactivos'],['🤖','Proyectos de robótica'],['🛠️','Herramientas técnicas']].map(([icon,label]) => (
              <div key={label} className="brand-feature">
                <span className="feature-icon">{icon}</span><span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="login-form-panel">
          <h2 className="login-title">INICIAR SESIÓN</h2>

          <div className="login-tabs" role="tablist">
            {(['ESTUDIANTE','DOCENTE','ADMIN'] as Tab[]).map(t => (
              <button key={t} role="tab" aria-selected={tab === t}
                className={`login-tab ${tab === t ? 'login-tab--active' : ''}`}
                onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Usuario / Email Institucional</label>
              <div className="form-input-wrap">
                <span className="form-icon">👤</span>
                <input type="email" className="form-input"
                  placeholder="ejemplo@edutech.edu.ve" defaultValue={`demo@edutech.edu.ve`} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div className="form-input-wrap">
                <span className="form-icon">🔒</span>
                <input type={showPw ? 'text' : 'password'} className="form-input"
                  placeholder="••••••••" defaultValue="demo1234" required />
                <button type="button" className="form-eye" onClick={() => setShowPw(p => !p)}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className="form-row">
              <label className="form-check"><input type="checkbox"/><span>Recordarme</span></label>
              <a href="#" className="form-forgot">¿Olvidaste tu contraseña?</a>
            </div>
            <button type="submit" className="btn-primary">ENTRAR →</button>
            <div className="login-divider"><span>o</span></div>
            <button type="button" className="btn-google" onClick={handleSubmit}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57C21.36 18.5 22.56 15.69 22.56 12.25z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              GOOGLE WORKSPACE
            </button>
          </form>
          <p className="login-footer">Soporte Técnico | <a href="#">Términos</a> | © 2025 Edu-Tech</p>
        </div>
      </div>
    </div>
  );
}
