import { Bell, ChevronDown, Command, Menu, Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { chapters, labs } from '../data/chapters';

type Props = { onMenu: () => void };
export function Topbar({ onMenu }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const chaptersFound = chapters.filter((c) => `${c.title} ${c.subtitle} ${c.topics.join(' ')}`.toLowerCase().includes(q)).slice(0, 4).map((c) => ({ title: c.title, description: `Chapter ${c.number} · ${c.subtitle}`, to: `/chapter/${c.id}` }));
    const labsFound = labs.filter((l) => `${l.title} ${l.description} ${l.chapterTitle}`.toLowerCase().includes(q)).slice(0, 5).map((l) => ({ title: l.title, description: `${l.chapterTitle} · Interactive lab`, to: `/simulation/${l.id}` }));
    return [...labsFound, ...chaptersFound].slice(0, 7);
  }, [query]);
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu-button" aria-label="Open navigation" onClick={onMenu}><Menu size={20} /></button>
      <div className="breadcrumb"><span>Workspace</span><ChevronDown size={14} /><strong>{location.pathname === '/' ? 'Overview' : location.pathname.startsWith('/chapter') ? 'Chapters' : location.pathname.startsWith('/simulation') ? 'Simulation lab' : location.pathname.slice(1).replace('-', ' ')}</strong></div>
      <div className={`search-wrap ${open ? 'search-open' : ''}`}>
        <Search size={17} className="search-icon" />
        <input value={query} onFocus={() => setOpen(true)} onChange={(e) => setQuery(e.target.value)} placeholder="Search chapters, formulas, labs…" aria-label="Search chapters, formulas, and labs" />
        {query ? <button className="search-clear" onClick={() => { setQuery(''); setOpen(false); }} aria-label="Clear search"><X size={15} /></button> : <kbd><Command size={11} /> K</kbd>}
        {open && query.trim() && <div className="search-results">{results.length ? results.map((item) => <button className="search-result" key={item.to} onClick={() => { navigate(item.to); setQuery(''); setOpen(false); }}><span className="search-result-icon"><Search size={15} /></span><span><strong>{item.title}</strong><small>{item.description}</small></span></button>) : <div className="search-empty">No matching chapters or labs.</div>}</div>}
      </div>
      <div className="topbar-actions"><span className="level-pill"><span /> JEE PREP</span><button className="icon-button" title="Workspace preferences" onClick={() => navigate('/practice')}><SlidersHorizontal size={18} /></button><button className="icon-button notification-button" title="No new notifications"><Bell size={18} /><i /></button><div className="avatar">SP</div></div>
      {open && <button className="click-outside" aria-label="Close search results" onClick={() => setOpen(false)} />}
    </header>
  );
}
