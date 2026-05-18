import { useState, useEffect, useRef } from 'react';

const API = 'http://localhost:3000';

function tierToConfidence(tier) {
  if (tier === 'top')  return 'high';
  if (tier === 'mid')  return 'medium';
  if (tier === 'pass') return 'low';
  return null;
}

function ScoreBadge({ score }) {
  if (score == null) return (
    <span style={{ color: '#F59E0B', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>
      Scoring…
    </span>
  );
  let bg, color, border;
  if (score >= 80)      { bg = 'rgba(16,185,129,0.15)';  color = '#10B981'; border = '1px solid rgba(16,185,129,0.3)'; }
  else if (score >= 60) { bg = 'rgba(245,158,11,0.15)';  color = '#F59E0B'; border = '1px solid rgba(245,158,11,0.3)'; }
  else                  { bg = 'rgba(239,68,68,0.15)';   color = '#EF4444'; border = '1px solid rgba(239,68,68,0.3)'; }
  return (
    <span style={{ background: bg, color, border, padding: '2px 10px', borderRadius: '6px', fontWeight: 600, fontSize: '13px' }}>
      {score}
    </span>
  );
}

function ConfidenceText({ confidence }) {
  const colors = { high: '#10B981', medium: '#F59E0B', low: '#EF4444' };
  if (!confidence) return <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>—</span>;
  return (
    <span style={{ color: colors[confidence] ?? 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '13px', textTransform: 'capitalize' }}>
      {confidence}
    </span>
  );
}

function Pill({ label }) {
  return (
    <span style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 9px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

const TH_STYLE = {
  textAlign: 'left', padding: '11px 16px',
  fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.35)',
  textTransform: 'uppercase', letterSpacing: '0.05em',
};

export default function Dashboard({ onSelectApp }) {
  const [founders,     setFounders]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const prevScoresRef = useRef({});

  function loadFounders() {
    fetch(`${API}/api/founders`)
      .then(r => r.json())
      .then(data => {
        setFounders(data.founders ?? []);
        setLastRefreshed(new Date());
        setLoading(false);
        // Track which founders just got a score (were null, now have one)
        const next = {};
        (data.founders ?? []).forEach(f => { next[f.id] = f.score; });
        prevScoresRef.current = next;
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }

  useEffect(() => {
    loadFounders();
    const interval = setInterval(loadFounders, 30000);
    return () => clearInterval(interval);
  }, []);

  const sorted   = [...founders].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  const total    = founders.length;
  const scored   = founders.filter(f => f.score != null);
  const avgScore = scored.length ? Math.round(scored.reduce((s, f) => s + f.score, 0) / scored.length) : 0;
  const highConf = founders.filter(f => f.score >= 80).length;
  const unscored = founders.filter(f => f.score == null).length;

  const stats = [
    { label: 'Total Founders',  value: total },
    { label: 'Average Score',   value: avgScore || '—' },
    { label: 'High Confidence', value: highConf, note: 'score ≥ 80' },
    { label: 'Scoring',         value: unscored, note: unscored > 0 ? 'in progress' : 'all scored' },
  ];

  const timeAgo = lastRefreshed
    ? `Updated ${Math.round((Date.now() - lastRefreshed) / 1000)}s ago`
    : '';

  if (loading) return (
    <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', padding: '48px 0' }}>
      Loading founders…
    </div>
  );

  if (error) return (
    <div style={{ color: '#EF4444', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', padding: '48px 0' }}>
      Error: {error}
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '34px', color: 'white', fontWeight: 400, lineHeight: 1.2 }}>
            {total} founders, <em style={{ color: '#10B981' }}>ranked.</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '6px' }}>
            Cohort 12 · CIP Catalyser Programme · sorted by AI score
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>
            {timeAgo} · auto-refreshes every 30s
          </span>
          <button
            onClick={loadFounders}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer' }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</p>
            <p style={{ fontSize: '30px', fontWeight: 700, color: stat.label === 'Scoring' && unscored > 0 ? '#F59E0B' : 'white', marginTop: '6px', lineHeight: 1 }}>{stat.value}</p>
            {stat.note && <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>{stat.note}</p>}
          </div>
        ))}
      </div>

      <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0D1421', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Rank', 'Company', 'Industry', 'Stage', 'Score', 'Confidence', 'Tier'].map(col => (
                <th key={col} style={TH_STYLE}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((founder, i) => (
              <tr
                key={founder.id}
                onClick={() => onSelectApp(founder)}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '14px 16px' }}>
                  <em style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '18px', color: 'rgba(255,255,255,0.2)' }}>{i + 1}</em>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <p style={{ fontWeight: 600, color: 'white', fontSize: '14px' }}>{founder.company_name}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{founder.name}</p>
                </td>
                <td style={{ padding: '14px 16px' }}><Pill label={founder.industry} /></td>
                <td style={{ padding: '14px 16px' }}><Pill label={founder.stage} /></td>
                <td style={{ padding: '14px 16px' }}><ScoreBadge score={founder.score} /></td>
                <td style={{ padding: '14px 16px' }}><ConfidenceText confidence={tierToConfidence(founder.tier)} /></td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>
                  {founder.tier ?? <span style={{ color: '#F59E0B', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>pending</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
