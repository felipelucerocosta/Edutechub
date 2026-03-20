// ==============================
// ASSIGNMENTS TAB
// Teacher: create assignments, grade students
// Student: view assignments
// ==============================
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { ClassRoom, AssignmentType } from '../../types';
import './AssignmentsTab.css';
import '../Modal.css';

interface Props { classroom: ClassRoom; }

export default function AssignmentsTab({ classroom }: Props) {
  const { user, assignments, grades, createAssignment, gradeAssignment } = useApp();
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  const clsAssignments = assignments.filter(a => a.classId === classroom.id);

  // New assignment form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', dueDate:'', type:'assignment' as AssignmentType, maxScore:10 });

  // Grade panel
  const [grading, setGrading] = useState<string | null>(null); // assignmentId
  const [gradeForm, setGradeForm] = useState<{ studentId:string; studentName:string; score:string; feedback:string } | null>(null);

  const handleCreate = () => {
    if (!form.title || !form.dueDate) return;
    createAssignment({ classId: classroom.id, ...form, maxScore: Number(form.maxScore) });
    setForm({ title:'', description:'', dueDate:'', type:'assignment', maxScore:10 });
    setShowForm(false);
  };

  const handleGrade = () => {
    if (!gradeForm || !grading) return;
    gradeAssignment({
      assignmentId: grading,
      classId: classroom.id,
      studentId: gradeForm.studentId,
      studentName: gradeForm.studentName,
      score: Number(gradeForm.score),
      feedback: gradeForm.feedback,
    });
    setGradeForm(null);
    setGrading(null);
  };

  const getGrade = (assignmentId: string, studentId: string) =>
    grades.find(g => g.assignmentId === assignmentId && g.studentId === studentId);

  return (
    <div className="assignments-wrap">
      {/* Teacher: create button */}
      {isTeacher && (
        <div className="asgn-toolbar">
          <button className="btn-create-asgn" onClick={() => setShowForm(p=>!p)}>
            {showForm ? '✕ Cancelar' : '+ Nuevo Trabajo / Examen'}
          </button>
        </div>
      )}

      {/* Create form */}
      {showForm && isTeacher && (
        <div className="asgn-form glass-card">
          <h4 className="asgn-form-title">Crear Nuevo Trabajo</h4>
          <div className="asgn-form-grid">
            <div className="form-group">
              <label className="form-label">Título</label>
              <div className="form-input-wrap">
                <input className="form-input" placeholder="Ej: Práctica 3 – Evasión de obstáculos" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Tipo</label>
              <select className="form-select" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value as AssignmentType}))}>
                <option value="assignment">Trabajo / Entrega</option>
                <option value="exam">Examen</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Fecha de entrega</label>
              <div className="form-input-wrap">
                <input type="date" className="form-input" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Nota máxima</label>
              <div className="form-input-wrap">
                <input type="number" className="form-input" min={1} max={100} value={form.maxScore} onChange={e=>setForm(f=>({...f,maxScore:Number(e.target.value)}))} />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <div className="form-input-wrap">
              <textarea className="form-input" rows={3} placeholder="Instrucciones del trabajo..." value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
            </div>
          </div>
          <button className="btn-modal-create" onClick={handleCreate}>Publicar Trabajo</button>
        </div>
      )}

      {/* Assignment list */}
      {clsAssignments.length === 0
        ? <div className="asgn-empty"><span>📝</span><p>No hay trabajos publicados en esta clase aún.</p></div>
        : clsAssignments.map(asgn => {
          const myGrade = !isTeacher ? getGrade(asgn.id, user!.id) : null;
          return (
            <div key={asgn.id} className="asgn-card glass-card">
              <div className="asgn-card-header">
                <span className={`asgn-type-badge asgn-type-badge--${asgn.type}`}>
                  {asgn.type === 'exam' ? '📋 Examen' : '📝 Trabajo'}
                </span>
                <span className="asgn-due">📅 {asgn.dueDate}</span>
                <span className="asgn-max">Nota máx: {asgn.maxScore}</span>
              </div>
              <h4 className="asgn-title">{asgn.title}</h4>
              {asgn.description && <p className="asgn-desc">{asgn.description}</p>}

              {/* Student: show my grade */}
              {!isTeacher && (
                <div className="asgn-my-grade">
                  {myGrade
                    ? <><span className="grade-score">{myGrade.score}/{asgn.maxScore}</span> <span className="grade-feedback">{myGrade.feedback}</span></>
                    : <span className="grade-pending">Sin calificar</span>
                  }
                </div>
              )}

              {/* Teacher: grade button */}
              {isTeacher && (
                <button className="btn-grade" onClick={() => { setGrading(asgn.id); setGradeForm({ studentId: 'u2', studentName: 'María García', score: '', feedback: '' }); }}>
                  ✏️ Calificar estudiantes
                </button>
              )}
            </div>
          );
        })
      }

      {/* Grade modal */}
      {grading && gradeForm && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setGrading(null)}>
          <div className="modal-box modal-box--sm">
            <h3 className="modal-title">✏️ Calificar</h3>
            <p className="modal-desc">Estudiante: <strong>{gradeForm.studentName}</strong></p>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nota</label>
                <div className="form-input-wrap">
                  <input type="number" className="form-input" placeholder="0–10" value={gradeForm.score} onChange={e=>setGradeForm(f=>f?{...f,score:e.target.value}:f)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Retroalimentación</label>
                <div className="form-input-wrap">
                  <input className="form-input" placeholder="Comentario para el estudiante..." value={gradeForm.feedback} onChange={e=>setGradeForm(f=>f?{...f,feedback:e.target.value}:f)} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={()=>setGrading(null)}>Cancelar</button>
              <button className="btn-modal-create" onClick={handleGrade}>Guardar Nota</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
