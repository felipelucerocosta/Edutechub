/* ============================
   SIDEBAR – Edu-Tech
   ============================ */
import './Sidebar.css';

type Page = 'dashboard' | 'forum' | 'resources' | 'support';

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems: { id: Page; icon: string; label: string }[] = [
  { id: 'dashboard', icon: '⊞', label: 'Panel de Control' },
  { id: 'forum',     icon: '📅', label: 'Próximas Entregas' },
  { id: 'resources', icon: '📁', label: 'Recursos' },
  { id: 'support',   icon: '💬', label: 'Soporte' },
];

export default function Sidebar({ activePage, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <span>T</span>
        </div>
        {!collapsed && <span className="sidebar-logo-text">Edu-Tech</span>}
      </div>

      <button className="sidebar-toggle" onClick={onToggle} aria-label="Colapsar menú">
        {collapsed ? '›' : '‹'}
      </button>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${activePage === item.id ? 'sidebar-item--active' : ''}`}
            onClick={() => onNavigate(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar-item-label">{item.label}</span>}
            {activePage === item.id && <span className="sidebar-item-indicator" />}
          </button>
        ))}
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">
          <div className="sidebar-footer-user">
            <div className="sidebar-avatar">JP</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">Juan Pérez</span>
              <span className="sidebar-user-role">Estudiante</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
