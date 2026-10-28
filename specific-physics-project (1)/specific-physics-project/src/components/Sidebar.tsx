import { BookOpen, ChevronLeft, ChevronRight, FlaskConical, Home, Library, Lightbulb, GraduationCap } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { chapters } from '../data/chapters';

type Props = { collapsed: boolean; mobileOpen: boolean; onClose: () => void };

export function Sidebar({ collapsed, mobileOpen, onClose }: Props) {
  return (
    <>
      {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={onClose} />}
      <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <NavLink to="/" className="brand" onClick={onClose}>
          <span className="brand-mark"><FlaskConical size={19} strokeWidth={2.2} /></span>
          {!collapsed && <span className="brand-copy"><strong>Specific Physics</strong><small>VIRTUAL LABORATORY</small></span>}
        </NavLink>
        <div className="sidebar-scroll">
          <div className="nav-label">WORKSPACE</div>
          <NavLink end to="/" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Overview">
            <Home size={18} /><span>Overview</span>
          </NavLink>
          <NavLink to="/formulas" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Formula library">
            <Library size={18} /><span>Formula library</span>
          </NavLink>
          <NavLink to="/practice" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Practice mode">
            <GraduationCap size={18} /><span>Practice mode</span>
          </NavLink>
          <div className="chapter-heading"><span className="nav-label">CLASS 11 SYLLABUS</span><span className="chapter-count">{chapters.length}</span></div>
          <div className="chapter-nav">
            {chapters.map((chapter) => (
              <NavLink key={chapter.id} to={`/chapter/${chapter.id}`} onClick={onClose} className={({ isActive }) => `nav-item chapter-link ${isActive ? 'active' : ''}`} title={chapter.title}>
                <span className="chapter-index">{String(chapter.number).padStart(2, '0')}</span>
                <span>{chapter.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
        {!collapsed && <div className="sidebar-footer"><span className="footer-icon"><Lightbulb size={16} /></span><div><strong>Learn by doing</strong><small>Change a variable. See the physics.</small></div></div>}
        <div className="sidebar-bottom"><BookOpen size={14} /><span>{collapsed ? 'JEE' : 'Built for curious minds'}</span></div>
      </aside>
    </>
  );
}
