import { useMemo } from 'react';

type Point = { x: number; y: number };
type Props = { title: string; xLabel: string; yLabel: string; points: Point[]; color?: string; zeroY?: boolean; height?: number; highlightX?: number };

export function Graph({ title, xLabel, yLabel, points, color = '#2563eb', zeroY = true, height = 176, highlightX }: Props) {
  const { path, zero, marker, minX, maxX, minY, maxY } = useMemo(() => {
    const w = 520, h = height, left = 42, right = 14, top = 15, bottom = 32;
    const xs = points.map((p) => p.x); const ys = points.map((p) => p.y);
    let minX = Math.min(0, ...xs), maxX = Math.max(1, ...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    if (minY === maxY) { minY -= 1; maxY += 1; }
    if (zeroY) { minY = Math.min(minY, 0); maxY = Math.max(maxY, 0); }
    const px = (x: number) => left + ((x - minX) / (maxX - minX || 1)) * (w - left - right);
    const py = (y: number) => top + ((maxY - y) / (maxY - minY || 1)) * (h - top - bottom);
    const path = points.map((p, i) => `${i ? 'L' : 'M'} ${px(p.x).toFixed(2)} ${py(p.y).toFixed(2)}`).join(' ');
    const zero = minY <= 0 && maxY >= 0 ? py(0) : null;
    const nearest = highlightX === undefined ? undefined : points.reduce<Point | undefined>((best, p) => !best || Math.abs(p.x - highlightX) < Math.abs(best.x - highlightX) ? p : best, undefined);
    const marker = nearest ? { x: px(nearest.x), y: py(nearest.y) } : undefined;
    return { path, zero, marker, minX, maxX, minY, maxY };
  }, [points, height, zeroY, highlightX]);
  return <div className="graph-wrap"><div className="graph-title"><strong>{title}</strong><span>{yLabel} vs {xLabel}</span></div><svg className="graph-svg" viewBox={`0 0 520 ${height}`} role="img" aria-label={`${title}, ${yLabel} against ${xLabel}`}>
    {[0, 1, 2, 3].map((i) => <line key={`v${i}`} x1={42 + i * 154.5} x2={42 + i * 154.5} y1="15" y2={height - 32} stroke="#e9edf3" strokeWidth="1" />)}
    {[0, 1, 2, 3].map((i) => <line key={`h${i}`} x1="42" x2="506" y1={15 + i * ((height - 47) / 3)} y2={15 + i * ((height - 47) / 3)} stroke="#e9edf3" strokeWidth="1" />)}
    {zero !== null && <line x1="42" x2="506" y1={zero} y2={zero} stroke="#9ca3af" strokeDasharray="4 4" />}
    <path d={path} fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    {marker && <><line x1={marker.x} x2={marker.x} y1={15} y2={height - 32} stroke={color} strokeDasharray="4 4" opacity=".55" /><circle cx={marker.x} cy={marker.y} r="5" fill={color} stroke="white" strokeWidth="2" /></>}
    <text x="42" y={height - 10} fill="#667085" fontSize="10">{minX.toFixed(1)}</text><text x="506" y={height - 10} textAnchor="end" fill="#667085" fontSize="10">{maxX.toFixed(1)}</text>
    <text x="8" y="16" fill="#667085" fontSize="10">{maxY.toFixed(1)}</text><text x="8" y={height - 34} fill="#667085" fontSize="10">{minY.toFixed(1)}</text><text x="274" y={height - 10} textAnchor="middle" fill="#344054" fontSize="10" fontWeight="600">{xLabel}</text>
  </svg></div>;
}
