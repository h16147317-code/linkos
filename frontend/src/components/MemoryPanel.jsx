import { mockMemory } from '../mockData';

function barColor(pct) {
  if (pct >= 90) return '#EF4444';
  if (pct >= 60) return '#F59E0B';
  return '#10B981';
}

export default function MemoryPanel() {
  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '38px', color: 'white', fontWeight: 400, lineHeight: 1.1 }}>
          The system that <em style={{ color: '#10B981' }}>never forgets.</em>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '8px' }}>
          Patterns are auto-detected across cohorts. Gemini surfaces bias, capacity risk, and historical drop-out signals.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* LEFT — Pattern flags */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h2 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '22px', color: 'white', fontWeight: 400 }}>Pattern flags</h2>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>auto-detected</span>
          </div>

          {mockMemory.patterns.map(p => {
            const isAlert    = p.severity === 'alert';
            const leftColor  = isAlert ? '#EF4444' : '#F59E0B';
            const badgeBg    = isAlert ? 'rgba(239,68,68,0.15)'   : 'rgba(245,158,11,0.15)';
            const badgeColor = isAlert ? '#EF4444'                 : '#F59E0B';
            return (
              <div key={p.id} style={{ background: '#111827', borderLeft: `3px solid ${leftColor}`, borderRadius: '8px', padding: '14px 16px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                    {p.id} · {p.severity}
                  </span>
                  <span style={{ background: badgeBg, color: badgeColor, padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 500 }}>
                    {p.severity}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.55, margin: 0 }}>
                  {p.pattern_text}
                </p>
              </div>
            );
          })}
        </div>

        {/* RIGHT — Mentor utilisation */}
        <div style={{ width: '320px', flexShrink: 0 }}>
          <h2 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '22px', color: 'white', fontWeight: 400, marginBottom: '14px' }}>Mentor utilisation</h2>
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px' }}>
            {mockMemory.mentor_utilisation.map((m, i) => {
              const pct    = m.utilisation_pct;
              const isLast = i === mockMemory.mentor_utilisation.length - 1;
              const pctCol = barColor(pct);
              return (
                <div key={m.mentor_id} style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)', paddingTop: i === 0 ? 0 : '12px', paddingBottom: isLast ? 0 : '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>{m.name}</span>
                    <span style={{ color: pctCol, fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 600 }}>{pct}%</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.08)', height: '6px', borderRadius: '99px', overflow: 'hidden', marginBottom: '6px' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: pctCol, borderRadius: '99px' }} />
                  </div>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{m.recommendation}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
