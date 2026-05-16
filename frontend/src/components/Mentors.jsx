import { mockMentors } from '../mockData';

function barColor(pct) {
  if (pct >= 90) return '#EF4444';
  if (pct >= 60) return '#F59E0B';
  return '#10B981';
}

function AvailBadge({ availability }) {
  const map = {
    available: { bg: 'rgba(16,185,129,0.15)',  color: '#10B981', border: 'rgba(16,185,129,0.3)' },
    limited:   { bg: 'rgba(245,158,11,0.15)',  color: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
    full:      { bg: 'rgba(239,68,68,0.15)',   color: '#EF4444', border: 'rgba(239,68,68,0.3)' },
  };
  const s = map[availability] ?? map.limited;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: '999px', padding: '3px 10px', fontSize: '11px', fontWeight: 500 }}>
      {availability}
    </span>
  );
}

export default function Mentors() {
  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '38px', color: 'white', fontWeight: 400, lineHeight: 1.1 }}>
          The brain behind <em style={{ color: '#10B981' }}>the matching.</em>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '8px' }}>
          Every mentor's capacity and track record is tracked. Gemini reads this when ranking matches.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {mockMentors.map(mentor => {
          const initials = mentor.name.split(' ').map(w => w[0]).join('').slice(0, 2);
          const pct = Math.round((mentor.current_load / mentor.capacity) * 100);
          return (
            <div key={mentor.id} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #10B981, #065F46)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <em style={{ fontFamily: 'Newsreader, Georgia, serif', color: 'white', fontSize: '16px', fontWeight: 500 }}>{initials}</em>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, color: 'white', fontSize: '15px', lineHeight: 1.2 }}>{mentor.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '3px', lineHeight: 1.3 }}>{mentor.role}</p>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <AvailBadge availability={mentor.availability} />
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '14px' }}>
                {mentor.expertise.map(tag => (
                  <span key={tag} style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '3px 8px', fontSize: '11px' }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Capacity</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{mentor.current_load} / {mentor.capacity}</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', height: '6px', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: barColor(pct), borderRadius: '99px' }} />
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Success Rate</p>
                  <p style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '22px', color: 'white', fontWeight: 400, margin: 0 }}>{Math.round(mentor.success_rate * 100)}%</p>
                </div>
                <div>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Cohorts</p>
                  <p style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '22px', color: 'white', fontWeight: 400, margin: 0 }}>{mentor.cohort_count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
