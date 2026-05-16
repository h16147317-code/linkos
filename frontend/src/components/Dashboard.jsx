import { mockApplications } from '../mockData';

function ScoreBadge({ score }) {
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
  const sorted = [...mockApplications].sort((a, b) => b.score - a.score);

  const total    = mockApplications.length;
  const avgScore = Math.round(mockApplications.reduce((s, a) => s + a.score, 0) / total);
  const highConf = mockApplications.filter(a => a.score >= 80).length;
  const pending  = mockApplications.filter(a => a.status === 'pending').length;

  const stats = [
    { label: 'Total Applications', value: total },
    { label: 'Average Score',      value: avgScore },
    { label: 'High Confidence',    value: highConf, note: 'score ≥ 80' },
    { label: 'Pending Review',     value: pending },
  ];

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '34px', color: 'white', fontWeight: 400, lineHeight: 1.2 }}>
          {total} applications, <em style={{ color: '#10B981' }}>ranked.</em>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '6px' }}>
          Cohort 12 · CIP Catalyser Programme · sorted by AI score
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</p>
            <p style={{ fontSize: '30px', fontWeight: 700, color: 'white', marginTop: '6px', lineHeight: 1 }}>{stat.value}</p>
            {stat.note && <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>{stat.note}</p>}
          </div>
        ))}
      </div>

      <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0D1421', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Rank', 'Company', 'Sector', 'Stage', 'Score', 'Confidence', 'Status'].map(col => (
                <th key={col} style={TH_STYLE}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((app, i) => (
              <tr
                key={app.id}
                onClick={() => onSelectApp(app)}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '14px 16px' }}>
                  <em style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '18px', color: 'rgba(255,255,255,0.2)' }}>{i + 1}</em>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <p style={{ fontWeight: 600, color: 'white', fontSize: '14px' }}>{app.company_name}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{app.founder_name}</p>
                </td>
                <td style={{ padding: '14px 16px' }}><Pill label={app.sector} /></td>
                <td style={{ padding: '14px 16px' }}><Pill label={app.stage} /></td>
                <td style={{ padding: '14px 16px' }}><ScoreBadge score={app.score} /></td>
                <td style={{ padding: '14px 16px' }}><ConfidenceText confidence={app.confidence} /></td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>
                  {app.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
