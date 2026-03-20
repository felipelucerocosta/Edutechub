// ==============================
// APP.TSX – Edu-Tech Platform
// Route: Login → ClassesView → ClassroomView
// ==============================
import { useState } from 'react';
import './index.css';
import './App.css';

import { AppProvider, useApp } from './context/AppContext';
import LoginPage      from './components/LoginPage';
import Navbar         from './components/Navbar';
import ClassesView    from './components/ClassesView';
import ClassroomView  from './components/ClassroomView';
import type { ClassRoom } from './types';

// Inner app (needs context)
function AppInner() {
  const { user, logout } = useApp();
  const [activeClass, setActiveClass] = useState<ClassRoom | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  // --- Login screen ---
  if (!user || !loggedIn) {
    return (
      <>
        <div className="app-bg" />
        <LoginPage onLogin={() => setLoggedIn(true)} />
      </>
    );
  }

  // --- Main shell ---
  return (
    <>
      <div className="app-bg" />
      <div className="app-layout">
        <div className="app-main">
          <Navbar
            activeClass={activeClass}
            onGoHome={() => setActiveClass(null)}
            onLogout={() => { logout(); setLoggedIn(false); setActiveClass(null); }}
          />
          <main className="app-content">
            {activeClass
              ? <ClassroomView classroom={activeClass} />
              : <ClassesView   onOpenClass={setActiveClass} />
            }
          </main>
        </div>
      </div>
    </>
  );
}

// Root wraps with provider
export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
