// ==============================
// GRADE BOOK TAB – Libreta Cuatrimestral
// Average of all assignments & exams per student
// ==============================
import { useApp } from '../../context/AppContext';
import type { ClassRoom } from '../../types';
import './GradeBookTab.css';

interface Props { classroom: ClassRoom; }

export default function GradeBookTab({ classroom }: Props) {
  const { user, assignments, grades, classes } = useApp();
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  const cls = classes.find(c => c.id === classroom.id)!;
  const clsAssignments = assignments.filter(a => a.classId === classroom.id);
  const clsGrades      = grades.filter(g => g.classId === classroom.id);

  // Build per-student rows (teachers see all; students see only themselves)
  const studentIds = isTeacher ? cls.memberIds : [user!.id];

  const rows = studentIds.map(sid => {
    const displayName = clsGrades.find(g => g.studentId === sid)?.studentName
      || (sid === user!.id ? user!.name : `Estudiante`);

    const gradeMap: Record<string, number | null> = {};
    clsAssignments.forEach(a => {
      const g = clsGrades.find(g => g.assignmentId === a.id && g.studentId === sid);
      gradeMap[a.id] = g ? (g.score / a.maxScore) * 10 : null;
    });
    const scores = Object.values(gradeMap).filter(v => v !== null) as number[];
    const avg = scores.length ? scores.reduce((s,v)=>s+v,0)/scores.length : null;
    return { sid, displayName, gradeMap, avg };
  });

  if (clsAssignments.length === 0) {
    return (
      <div className="gradebook-empty">
        <span>📊</span>
        <p>La libreta estará disponible cuando se publiquen trabajos o exámenes.</p>
      </div>
    );
  }

  return (
    <div className="gradebook-wrap">
      <div className="gradebook-header">
        <h3 className="gradebook-title">📊 Libreta Cuatrimestral</h3>
        <p className="gradebook-subtitle">{classroom.subject} · {classroom.course} – Div. {classroom.division}</p>
      </div>

      <div className="gradebook-table-wrap">
        <table className="gradebook-table">
          <thead>
            <tr>
              <th className="gb-th gb-th--student">Estudiante</th>
              {clsAssignments.map(a => (
                <th key={a.id} className="gb-th">
                  <div className={`gb-asgn-label gb-asgn-label--${a.type}`}>
                    {a.type === 'exam' ? '📋' : '📝'} {a.title}
                  </div>
                  <div className="gb-asgn-date">{a.dueDate}</div>
                </th>
              ))}
              <th className="gb-th gb-th--avg">Promedio</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const avgVal = row.avg;
              const avgClass = avgVal === null ? '' : avgVal >= 7 ? 'grade--pass' : avgVal >= 5 ? 'grade--mid' : 'grade--fail';
              return (
                <tr key={row.sid} className={`gb-row ${row.sid === user!.id ? 'gb-row--me' : ''}`}>
                  <td className="gb-td gb-td--student">
                    <div className="gb-student-cell">
                      <div className="gb-avatar">{row.displayName.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                      <span>{row.displayName}</span>
                    </div>
                  </td>
                  {clsAssignments.map(a => {
                    const score = row.gradeMap[a.id];
                    const cls = score === null ? 'grade--empty' : score >= 7 ? 'grade--pass' : score >= 5 ? 'grade--mid' : 'grade--fail';
                    return (
                      <td key={a.id} className={`gb-td ${cls}`}>
                        {score !== null ? score.toFixed(1) : '–'}
                      </td>
                    );
                  })}
                  <td className={`gb-td gb-td--avg ${avgClass}`}>
                    {avgVal !== null ? <strong>{avgVal.toFixed(2)}</strong> : '–'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="gradebook-legend">
        <span className="legend-item grade--pass">≥ 7 Aprobado</span>
        <span className="legend-item grade--mid">5–6.9 Regular</span>
        <span className="legend-item grade--fail">{'< 5 Reprobado'}</span>
      </div>
    </div>
  );
}
