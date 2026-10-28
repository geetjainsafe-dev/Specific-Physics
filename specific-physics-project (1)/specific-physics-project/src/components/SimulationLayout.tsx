import { ArrowLeft, ArrowRight, CircleHelp, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Lab } from '../data/chapters';

export function SimulationLayout({ lab, controls, visualization, results, formulas, graph, note, playing, onPlay, onPause, onReset, onStep, timeLabel }: {
  lab: Lab & { chapterId: string; chapterTitle: string; chapterNumber: number };
  controls: ReactNode; visualization: ReactNode; results: ReactNode; formulas: ReactNode; graph?: ReactNode; note?: string;
  playing?: boolean; onPlay?: () => void; onPause?: () => void; onReset?: () => void; onStep?: (amount: number) => void; timeLabel?: string;
}) {
  return <div className="page-content simulation-page"><div className="page-back"><Link to={`/chapter/${lab.chapterId}`}><ArrowLeft size={15} /> Chapter {lab.chapterNumber} · {lab.chapterTitle}</Link><span className="level-pill compact"><span /> {lab.level}</span></div>
    <div className="simulation-heading"><div><div className="eyebrow">INTERACTIVE LABORATORY / CHAPTER {String(lab.chapterNumber).padStart(2, '0')}</div><h1>{lab.title}</h1><p>{lab.description}</p></div><span className="lab-badge"><span className="live-dot" /> LIVE MODEL</span></div>
    <div className="workspace-grid"><aside className="workspace-controls"><div className="workspace-section-head"><div><span className="eyebrow">EXPERIMENT SETUP</span><h2>Parameters</h2></div><RotateCcw size={16} className="muted-icon" /></div>{controls}<div className="assumptions"><CircleHelp size={16} /><div><strong>Model assumptions</strong><p>{note || 'Idealized model. Values update from the equations shown below; real experiments may include additional effects.'}</p></div></div></aside>
      <div className="workspace-main"><section className="visual-panel"><div className="visual-panel-head"><div><span className="eyebrow">LIVE VISUALIZATION</span><h2>Experiment view</h2></div><div className="live-chip"><span /> updating</div></div><div className="visual-canvas">{visualization}</div><div className="playback-bar"><div className="playback-buttons">{onReset && <button onClick={onReset} title="Reset simulation"><RotateCcw size={16} /></button>}{onStep && <button onClick={() => onStep(-1)} title="Step backward"><ArrowLeft size={16} /></button>}{playing ? <button className="play-button" onClick={onPause} title="Pause simulation"><span className="pause-glyph">Ⅱ</span></button> : onPlay ? <button className="play-button" onClick={onPlay} title="Play simulation"><span className="play-glyph">▶</span></button> : null}{onStep && <button onClick={() => onStep(1)} title="Step forward"><ArrowRight size={16} /></button>}</div><div className="time-display"><span>SIMULATION TIME</span><strong>{timeLabel || 'Ready'}</strong></div><div className={`status-indicator ${playing ? 'is-running' : ''}`}><i />{playing ? 'Running' : 'Paused'}</div></div></section>
        <section className="results-section"><div className="section-title"><h2>Live results</h2><span>Calculated from current parameters</span></div><div className="metrics-grid">{results}</div></section>
        {graph && <section className="graph-panel">{graph}</section>}
        <section className="formula-panel"><div className="section-title"><h2>Physics behind it</h2><span>Core equations</span></div>{formulas}</section>
      </div>
    </div>
  </div>;
}
