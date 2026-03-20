// ==============================
// CLASSROOM VIEW – Shell with 4 tabs
// Calendario | Foro | Trabajos | Libreta
// ==============================
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { ClassRoom } from '../types';
import CalendarTab     from './classroom/CalendarTab.tsx';
import ForumTab        from './classroom/ForumTab.tsx';
import AssignmentsTab  from './classroom/AssignmentsTab.tsx';
import GradeBookTab    from './classroom/GradeBookTab.tsx';
import './ClassroomView.css';

type Tab = 'calendar' | 'forum' | 'assignments' | 'gradebook';

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'calendar',    icon: '📅', label: 'Calendario' },
  { id: 'forum',       icon: '💬', label: 'Foro' },
  { id: 'assignments', icon: '📝', label: 'Trabajos' },
  { id: 'gradebook',   icon: '📊', label: 'Libreta' },
];

interface Props { classroom: ClassRoom; }

export default function ClassroomView({ classroom }: Props) {
  const { user } = useApp();
  const [tab, setTab] = useState<Tab>('forum');

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  return (
    <div className="classroom-view">
      {/* Class banner */}
      <div className="classroom-banner">
        <div className="classroom-banner-info">
          <h2 className="classroom-subject">{classroom.subject}</h2>
          <p className="classroom-meta">{classroom.course} – División {classroom.division} · {classroom.teacherName}</p>
        </div>
        {isTeacher && (
          <div className="classroom-code-badge">
            <span className="code-label">Código de invitación</span>
            <span className="code-value">{classroom.code}</span>
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div className="classroom-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`classroom-tab ${tab === t.id ? 'classroom-tab--active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="classroom-content">
        {tab === 'calendar'    && <CalendarTab    classroom={classroom} />}
        {tab === 'forum'       && <ForumTab        classroom={classroom} />}
        {tab === 'assignments' && <AssignmentsTab  classroom={classroom} />}
        {tab === 'gradebook'   && <GradeBookTab    classroom={classroom} />}
      </div>
    </div>
  );
}
