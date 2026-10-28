import type { ReactNode } from 'react';

export function RangeControl({ label, value, min, max, step = 1, unit = '', onChange, format }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (value: number) => void; format?: (value: number) => string }) {
  return <label className="range-control"><span className="range-label"><span>{label}</span><strong>{format ? format(value) : `${Number(value.toFixed(3))}${unit ? ` ${unit}` : ''}`}</strong></span><input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} /><span className="range-limits"><small>{min}{unit ? ` ${unit}` : ''}</small><small>{max}{unit ? ` ${unit}` : ''}</small></span></label>;
}

export function ToggleControl({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="toggle-control"><span>{label}</span><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /><span className="toggle-track" /></label>;
}

export function SelectControl({ label, value, options, onChange }: { label: string; value: string; options: { label: string; value: string }[]; onChange: (value: string) => void }) {
  return <label className="select-control"><span>{label}</span><select value={value} onChange={(e) => onChange(e.target.value)}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

export function MetricCard({ label, value, unit, accent = 'blue', note }: { label: string; value: string; unit?: string; accent?: string; note?: string }) {
  return <div className={`metric-card accent-${accent}`}><span className="metric-dot" /><span className="metric-label">{label}</span><strong>{value}<small>{unit ? ` ${unit}` : ''}</small></strong>{note && <em>{note}</em>}</div>;
}

export function Panel({ title, aside, children, className = '' }: { title: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`panel ${className}`}><div className="panel-heading"><h3>{title}</h3>{aside}</div>{children}</section>;
}

export function Formula({ expression, caption }: { expression: string; caption: string }) {
  return <div className="formula-row"><div className="formula-expression">{expression}</div><div className="formula-caption">{caption}</div></div>;
}

export function Legend({ items }: { items: { color: string; label: string; dashed?: boolean }[] }) {
  return <div className="legend">{items.map((item) => <span key={item.label}><i className={item.dashed ? 'dashed' : ''} style={{ backgroundColor: item.dashed ? 'transparent' : item.color, borderColor: item.color }} />{item.label}</span>)}</div>;
}
