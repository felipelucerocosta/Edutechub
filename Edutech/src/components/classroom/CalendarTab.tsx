// ==============================
// CALENDAR TAB
// ==============================
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { ClassRoom, CalendarEvent } from '../../types';
import './CalendarTab.css';
import '../Modal.css';


interface Props { classroom: ClassRoom; }

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAYS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const TYPE_COLORS: Record<string, string> = {
  class:'#1a6fff', assignment:'#f59e0b', exam:'#ef4444', event:'#10b981'
};
const TYPE_LABELS: Record<string, string> = {
  class:'Clase', assignment:'Entrega', exam:'Examen', event:'Evento'
};

export default function CalendarTab({ classroom }: Props) {
  const { user, events, addEvent, deleteEvent } = useApp();
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  // New event form
  const [form, setForm] = useState({ title:'', time:'08:00', type:'class' as CalendarEvent['type'], description:'' });

  const classEvents = events.filter(e => e.classId === classroom.id);

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({length:daysInMonth},(_,i)=>i+1)];

  const dateStr = (day: number) => `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  const eventsOnDay = (day: number) => classEvents.filter(e => e.date === dateStr(day));

  const handleDayClick = (day: number) => {
    if (!isTeacher) return;
    setSelectedDate(dateStr(day));
    setShowModal(true);
  };

  const handleAdd = () => {
    if (!form.title) return;
    addEvent({ classId: classroom.id, date: selectedDate, ...form });
    setShowModal(false);
    setForm({ title:'', time:'08:00', type:'class', description:'' });
  };

  return (
    <div className="cal-wrap">
      {/* Upcoming events sidebar */}
      <aside className="cal-sidebar">
        <h4 className="cal-sidebar-title">Próximos Eventos</h4>
        {classEvents.length === 0
          ? <p className="cal-empty">Sin eventos agendados.</p>
          : [...classEvents].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,8).map(ev => (
            <div key={ev.id} className="cal-event-item" style={{'--dot':TYPE_COLORS[ev.type]} as React.CSSProperties}>
              <div className="cal-event-dot" />
              <div className="cal-event-body">
                <p className="cal-event-title">{ev.title}</p>
                <p className="cal-event-meta">{ev.date} · {ev.time} · <span style={{color:TYPE_COLORS[ev.type]}}>{TYPE_LABELS[ev.type]}</span></p>
              </div>
              {isTeacher && (
                <button className="cal-event-del" onClick={() => deleteEvent(ev.id)}>✕</button>
              )}
            </div>
          ))
        }
      </aside>

      {/* Main calendar */}
      <div className="cal-main">
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={() => { if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); }}>‹</button>
          <h3 className="cal-month">{MONTH_NAMES[month]} {year}</h3>
          <button className="cal-nav-btn" onClick={() => { if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); }}>›</button>
        </div>

        <div className="cal-grid-head">
          {DAYS.map(d => <div key={d} className="cal-day-name">{d}</div>)}
        </div>
        <div className="cal-grid">
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} className="cal-cell cal-cell--empty" />;
            const dayEvts = eventsOnDay(day);
            const isToday = today.getDate()===day && today.getMonth()===month && today.getFullYear()===year;
            return (
              <div
                key={day}
                className={`cal-cell ${isToday?'cal-cell--today':''} ${isTeacher?'cal-cell--clickable':''}`}
                onClick={() => handleDayClick(day)}
              >
                <span className="cal-cell-num">{day}</span>
                <div className="cal-cell-dots">
                  {dayEvts.slice(0,3).map(ev => (
                    <span key={ev.id} className="cal-dot" style={{background:TYPE_COLORS[ev.type]}} title={ev.title} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {isTeacher && <p className="cal-hint">💡 Haz clic en un día para agregar un evento</p>}
      </div>

      {/* Add event modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal-box modal-box--sm">
            <h3 className="modal-title">📅 Nuevo Evento – {selectedDate}</h3>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Título</label>
                <div className="form-input-wrap">
                  <input className="form-input" placeholder="Ej: Examen Práctico N°3" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Hora</label>
                  <div className="form-input-wrap">
                    <input type="time" className="form-input" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Tipo</label>
                  <select className="form-select" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value as CalendarEvent['type']}))}>
                    <option value="class">Clase</option>
                    <option value="assignment">Entrega</option>
                    <option value="exam">Examen</option>
                    <option value="event">Evento</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Descripción (opcional)</label>
                <div className="form-input-wrap">
                  <input className="form-input" placeholder="Detalles del evento..." value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={()=>setShowModal(false)}>Cancelar</button>
              <button className="btn-modal-create" onClick={handleAdd}>Agregar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
