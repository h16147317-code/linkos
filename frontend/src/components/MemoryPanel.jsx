import { useState, useEffect } from 'react';

const API = 'http://localhost:3000';

function barColor(pct) {
  if (pct >= 90) return '#EF4444';
  if (pct >= 60) return '#F59E0B';
  return '#10B981';
}

export default function MemoryPanel() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    fetch(`${API}/api/memory`)
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', padding: '48px 0' }}>
      Loading memory…
    </div>
  );

  if (error) return (
    <div style={{ color: '#EF4444', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', padding: '48px 0' }}>
      Error: {error}
    </div>
  );

  const patterns          = data?.cohort_patterns    ?? [];
  const mentorUtilisation = data?.mentor_utilisation ?? [];

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

          {patterns.length === 0 && (
            <div style={{ background: '#111827', borderRadius: '8px', padding: '24px', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
              No patterns detected yet.
            </div>
          )}

          {patterns.map(p => {
            const isAlert    = p.severity === 'alert';
            const leftColor  = isAlert ? '#EF4444' : '#F59E0B';
            const badgeBg    = isAlert ? 'rgba(239,68,68,0.15)'   : 'rgba(245,158,11,0.15)';
            const badgeColor = isAlert ? '#EF4444'                 : '#F59E0B';
            return (
              <div key={p.id} style={{ background: '#111827', borderLeft: `3px solid ${leftColor}`, borderRadius: '8px', padding: '14px 16px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                    {p.id.slice(0, 8)} · {p.severity}
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
            {mentorUtilisation.length === 0 && (
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', margin: 0 }}>No mentors with linkages yet.</p>
            )}
            {mentorUtilisation.map((m, i) => {
              const pct    = m.utilisation_pct;
              const isLast = i === mentorUtilisation.length - 1;
              const pctCol = barColor(pct);
              return (
                <div key={m.id} style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)', paddingTop: i === 0 ? 0 : '12px', paddingBottom: isLast ? 0 : '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>{m.name}</span>
                    <span style={{ color: pctCol, fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 600 }}>{pct}%</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.08)', height: '6px', borderRadius: '99px', overflow: 'hidden', marginBottom: '6px' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: pctCol, borderRadius: '99px' }} />
                  </div>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                    {m.current_load}/{m.capacity} slots used · {Math.round(m.success_rate * 100)}% success rate
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
