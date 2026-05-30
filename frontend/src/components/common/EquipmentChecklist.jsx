import React, { useState } from 'react';
import { CheckCircle, Circle, Download, RefreshCw } from 'lucide-react';

const EQUIPMENT_BY_DIFFICULTY = {
  easy: [
    'Comfortable hiking shoes', 'Water bottle (2L)', 'Snacks/trail mix',
    'Sunscreen SPF 50+', 'Sunglasses', 'Light rain jacket', 'Hat/cap',
    'First aid kit', 'Charged phone', 'Map/compass',
  ],
  moderate: [
    'Trekking boots (ankle support)', 'Water (3L+)', 'Energy bars & meals',
    'Trekking poles', 'Blister kit', 'Warm mid-layer', 'Rain jacket & pants',
    'Headlamp + spare batteries', 'Emergency whistle', 'Navigation app offline',
    'Sunscreen SPF 50+', 'Insect repellent',
  ],
  hard: [
    'Waterproof trekking boots', 'Hydration pack (3L+)', 'Freeze-dried meals',
    'Trekking poles', 'Sleeping bag (0°C rated)', 'Insulated jacket',
    'Waterproof outer layer', 'Gaiters', 'Headlamp + extra batteries',
    'Emergency bivouac bag', 'Satellite communicator', 'Altitude sickness medication',
    'Sunscreen SPF 70+', 'Snow goggles', 'Blister kit',
  ],
  extreme: [
    'Mountaineering boots', 'Crampons', 'Ice axe', 'Harness',
    'Helmet', 'Carabiners & rope', 'Hydration pack (4L+)',
    'High-calorie expedition food', 'Down jacket (-20°C rated)', 'Down sleeping bag (-30°C)',
    'Tent (4-season)', 'Glacier glasses', 'Summit suit',
    'Altitude medication (Diamox)', 'Pulse oximeter', 'Satellite phone',
    'Crevasse rescue kit', 'Emergency beacon (PLB)',
  ],
};

export default function EquipmentChecklist({ difficulty = 'moderate', required = [] }) {
  const baseList = EQUIPMENT_BY_DIFFICULTY[difficulty] || EQUIPMENT_BY_DIFFICULTY.moderate;
  const allItems = [...new Set([...baseList, ...required])];
  const [checked, setChecked] = useState(new Set());

  const toggle = (item) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const checkAll = () => setChecked(new Set(allItems));
  const reset = () => setChecked(new Set());
  const progress = Math.round((checked.size / allItems.length) * 100);

  const downloadList = () => {
    const text = allItems.map(i => `[${checked.has(i) ? 'x' : ' '}] ${i}`).join('\n');
    const blob = new Blob([`Equipment Checklist (${difficulty})\n${'='.repeat(30)}\n\n${text}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'trailconnect-checklist.txt';
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div style={{ background: 'var(--mist)', borderRadius: 12, padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
        <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>🎒 Equipment Checklist</h4>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost btn-sm" onClick={checkAll} title="Check all"><CheckCircle size={14} /> All</button>
          <button className="btn btn-ghost btn-sm" onClick={reset} title="Reset"><RefreshCw size={14} /></button>
          <button className="btn btn-outline btn-sm" onClick={downloadList}><Download size={14} /></button>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>
          <span>{checked.size}/{allItems.length} packed</span>
          <span>{progress}%</span>
        </div>
        <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: progress === 100 ? '#22c55e' : 'var(--forest-light)', borderRadius: 3, transition: 'width 0.3s ease' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {allItems.map((item, i) => (
          <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 8px', borderRadius: 8, background: checked.has(item) ? 'rgba(45,122,87,0.08)' : 'transparent', transition: 'background 0.15s' }}>
            <input type="checkbox" style={{ display: 'none' }} checked={checked.has(item)} onChange={() => toggle(item)} />
            {checked.has(item)
              ? <CheckCircle size={18} color="var(--forest-light)" />
              : <Circle size={18} color="var(--stone)" />}
            <span style={{ fontSize: '0.88rem', textDecoration: checked.has(item) ? 'line-through' : 'none', color: checked.has(item) ? 'var(--text-muted)' : 'var(--text)', transition: 'all 0.15s' }}>
              {item}
              {required.includes(item) && <span style={{ marginLeft: 6, fontSize: '0.72rem', color: '#ef4444', fontWeight: 700 }}>REQUIRED</span>}
            </span>
          </label>
        ))}
      </div>

      {progress === 100 && (
        <div style={{ marginTop: '1rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: '0.88rem', color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle size={16} /> You're fully packed and ready to go! 🏔
        </div>
      )}
    </div>
  );
}
