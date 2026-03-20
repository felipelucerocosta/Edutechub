// ==============================
// FORUM TAB – Posts + Grade Ranking sidebar
// ==============================
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { ClassRoom } from '../../types';
import './ForumTab.css';

interface Props { classroom: ClassRoom; }

export default function ForumTab({ classroom }: Props) {
  const { user, posts, grades, assignments, addPost, likePost, addComment } = useApp();
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [openComment, setOpenComment] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const clsPosts = posts.filter(p => p.classId === classroom.id);
  const clsAssignments = assignments.filter(a => a.classId === classroom.id);

  // Grade ranking: average per student across all graded assignments in this class
  const clsGrades = grades.filter(g => g.classId === classroom.id);
  const studentMap: Record<string, { name: string; total: number; count: number }> = {};
  clsGrades.forEach(g => {
    if (!studentMap[g.studentId]) studentMap[g.studentId] = { name: g.studentName, total: 0, count: 0 };
    const asgn = clsAssignments.find(a => a.id === g.assignmentId);
    if (asgn) {
      studentMap[g.studentId].total += (g.score / asgn.maxScore) * 10;
      studentMap[g.studentId].count++;
    }
  });
  const ranking = Object.entries(studentMap)
    .map(([id, v]) => ({ id, name: v.name, avg: v.count ? v.total / v.count : 0 }))
    .sort((a, b) => b.avg - a.avg);

  const handlePost = () => {
    if (!newTitle.trim()) return;
    addPost({
      classId: classroom.id,
      authorId: user!.id,
      authorName: user!.name,
      authorAvatar: user!.avatar,
      title: newTitle,
      body: newBody,
    });
    setNewTitle(''); setNewBody('');
  };

  const handleComment = (postId: string) => {
    if (!commentText.trim()) return;
    addComment(postId, {
      authorId: user!.id,
      authorName: user!.name,
      authorAvatar: user!.avatar,
      body: commentText,
    });
    setCommentText(''); setOpenComment(null);
  };

  return (
    <div className="forum-layout">
      {/* Posts */}
      <div className="forum-main">
        {/* Compose */}
        <div className="forum-compose glass-card">
          <div className="compose-avatar">{user?.avatar}</div>
          <div className="compose-fields">
            <input className="compose-input" placeholder="Título de la publicación..." value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <textarea className="compose-textarea" placeholder="Comparte dudas, proyectos o anuncios..." rows={2} value={newBody} onChange={e => setNewBody(e.target.value)} />
          </div>
          <button className="compose-btn" onClick={handlePost}>Publicar</button>
        </div>

        {clsPosts.length === 0
          ? <div className="forum-empty"><span>💬</span><p>Sé el primero en publicar algo en el foro.</p></div>
          : clsPosts.map(post => (
            <article key={post.id} className="forum-post glass-card">
              <div className="post-header">
                <div className="post-avatar-badge">{post.authorAvatar}</div>
                <div><p className="post-author">{post.authorName}</p><p className="post-time">{post.createdAt.slice(0, 10)}</p></div>
              </div>
              <h4 className="post-title">{post.title}</h4>
              {post.body && <p className="post-body">{post.body}</p>}
              <div className="post-actions">
                <button className={`post-action ${post.likes.includes(user!.id) ? 'post-action--liked' : ''}`} onClick={() => likePost(post.id, user!.id)}>
                  👍 {post.likes.length}
                </button>
                <button className="post-action" onClick={() => setOpenComment(openComment === post.id ? null : post.id)}>
                  💬 {post.comments.length}
                </button>
              </div>
              {/* Comments */}
              {openComment === post.id && (
                <div className="post-comments">
                  {post.comments.map(c => (
                    <div key={c.id} className="comment-row">
                      <span className="comment-avatar">{c.authorAvatar}</span>
                      <div className="comment-body"><strong>{c.authorName}</strong><p>{c.body}</p></div>
                    </div>
                  ))}
                  <div className="comment-compose">
                    <input className="comment-input" placeholder="Escribe un comentario..." value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleComment(post.id)} />
                    <button className="compose-btn compose-btn--sm" onClick={() => handleComment(post.id)}>→</button>
                  </div>
                </div>
              )}
            </article>
          ))
        }
      </div>

      {/* Ranking sidebar */}
      <aside className="forum-sidebar">
        <div className="glass-card ranking-card">
          <h5 className="ranking-title">🏆 RANKING DE NOTAS</h5>
          {ranking.length === 0
            ? <p className="ranking-empty">Sin calificaciones aún.</p>
            : ranking.map((s, i) => (
              <div key={s.id} className={`ranking-row ${i === 0 ? 'ranking-row--gold' : i === 1 ? 'ranking-row--silver' : i === 2 ? 'ranking-row--bronze' : ''}`}>
                <span className="ranking-pos">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                <div className="ranking-avatar">{s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                <span className="ranking-name">{s.name}</span>
                <span className="ranking-avg">{s.avg.toFixed(1)}</span>
              </div>
            ))
          }
        </div>

        <div className="glass-card members-card">
          <h5 className="ranking-title">👥 MIEMBROS</h5>
          <p className="members-count">{classroom.memberIds.length} participantes</p>
        </div>
      </aside>
    </div>
  );
}
