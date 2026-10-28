import { useState } from 'react';
import { ArrowRightLeft, Ruler } from 'lucide-react';
import { Formula, MetricCard, RangeControl, SelectControl } from '../../components/Controls';
import { SimulationLayout } from '../../components/SimulationLayout';
import { fixed } from '../../components/useSimClock';
import { getLab } from '../../data/chapters';

const conversions: Record<string, { label: string; from: string; to: string; factor: number; description: string }> = {
  kmh: { label: 'Speed: km/h → m/s', from: 'km/h', to: 'm/s', factor: 1 / 3.6, description: 'Divide the speed in km/h by 3.6.' },
  ms: { label: 'Speed: m/s → km/h', from: 'm/s', to: 'km/h', factor: 3.6, description: 'Multiply the speed in m/s by 3.6.' },
  cm: { label: 'Length: cm → m', from: 'cm', to: 'm', factor: 0.01, description: 'One centimetre equals 10⁻² metres.' },
  km: { label: 'Length: km → m', from: 'km', to: 'm', factor: 1000, description: 'One kilometre equals 1000 metres.' },
  g: { label: 'Mass: g → kg', from: 'g', to: 'kg', factor: 0.001, description: 'One gram equals 10⁻³ kilograms.' },
  hour: { label: 'Time: hour → s', from: 'h', to: 's', factor: 3600, description: 'One hour equals 3600 seconds.' },
  area: { label: 'Area: cm² → m²', from: 'cm²', to: 'm²', factor: 0.0001, description: 'Area units square the length conversion: (10⁻²)² = 10⁻⁴.' },
  pressure: { label: 'Pressure: kPa → Pa', from: 'kPa', to: 'Pa', factor: 1000, description: 'One kilopascal equals 1000 pascals.' },
};

export function UnitConverterLab() {
  const lab = getLab('unit-converter')!;
  const [kind, setKind] = useState('kmh'); const [value, setValue] = useState(72);
  const chosen = conversions[kind]; const converted = value * chosen.factor;
  return <SimulationLayout lab={lab} controls={<><SelectControl label="Conversion type" value={kind} onChange={setKind} options={Object.entries(conversions).map(([value, c])=>({value,label:c.label}))}/><RangeControl label={`Input value (${chosen.from})`} value={value} min={0} max={kind==='hour'?24:kind==='km'?100:kind==='pressure'?500:200} step={kind==='hour'?.25:1} onChange={setValue}/><div className="conversion-card"><span>INPUT</span><strong>{fixed(value,3)} <small>{chosen.from}</small></strong><ArrowRightLeft size={20}/><span>RESULT</span><strong>{Number(converted.toPrecision(7)).toLocaleString('en-IN')} <small>{chosen.to}</small></strong></div><p className="control-note">{chosen.description}</p></>}
    visualization={<div className="unit-visual"><div className="unit-ruler"><div className="unit-icon"><Ruler size={25}/></div><div><span>ORIGINAL QUANTITY</span><strong>{fixed(value,3)} {chosen.from}</strong></div></div><div className="conversion-arrow"><span>× {chosen.factor.toPrecision(5)}</span><i /></div><div className="unit-ruler result"><div className="unit-icon"><ArrowRightLeft size={24}/></div><div><span>SI / TARGET QUANTITY</span><strong>{Number(converted.toPrecision(7)).toLocaleString('en-IN')} {chosen.to}</strong></div></div></div>}
    results={<><MetricCard label="Input" value={fixed(value,3)} unit={chosen.from} accent="blue"/><MetricCard label="Conversion factor" value={Number(chosen.factor.toPrecision(5)).toString()} accent="purple"/><MetricCard label="Converted value" value={Number(converted.toPrecision(7)).toLocaleString('en-IN')} unit={chosen.to} accent="cyan"/><MetricCard label="Quantity type" value={kind==='cm'||kind==='km'?'Length':kind==='g'?'Mass':kind==='hour'?'Time':kind==='area'?'Area':kind==='pressure'?'Pressure':'Speed'} accent="green"/></>}
    formulas={<div className="formula-grid"><Formula expression="Target value = Input value × conversion factor" caption="Multiply by the exact ratio of the chosen units"/><Formula expression="1 km/h = 5/18 m/s" caption="Useful speed conversion for mechanics problems"/><Formula expression="[Q] is unchanged by unit conversion" caption="The physical quantity remains the same; only its numerical representation changes"/></div>}
    note="These presets use standard unit ratios. The dimensional-analysis explorer in a later update can extend this into derived dimensions and uncertainty propagation."/>;
}
