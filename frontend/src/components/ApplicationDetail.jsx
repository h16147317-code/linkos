const POSITIVE_FLAGS = new Set(['strong_traction', 'strong_team', 'market_validated', 'b2b_traction', 'regional_strength']);

function scoreColor(score) {
  if (score >= 80) return '#10B981';
  if (score >= 60) return '#F59E0B';
  return '#EF4444';
}

function FlagPill({ flag }) {
  const positive = POSITIVE_FLAGS.has(flag);
  const label = flag.replace(/_/g, ' ');
  return (
    <span style={{
      background: positive ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
      color:      positive ? '#10B981'                : '#F59E0B',
      border:     `1px solid ${positive ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
      borderRadius: '999px', padding: '5px 12px', fontSize: '12px', fontWeight: 500,
    }}>
      {label}
    </span>
  );
}

function MentorCard({ suggestion }) {
  const initials = suggestion.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  return (
    <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #10B981, #065F46)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <em style={{ fontFamily: 'Newsreader, Georgia, serif', color: 'white', fontSize: '15px', fontWeight: 500 }}>{initials}</em>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 600, color: 'white', fontSize: '14px', lineHeight: 1.2 }}>{suggestion.name}</p>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '24px', fontStyle: 'italic', color: '#10B981', lineHeight: 1 }}>
            {suggestion.match_score}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>
            match
          </div>
        </div>
      </div>

      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: '12px' }}>
        {suggestion.reason}
      </p>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{
          flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
          color: 'rgba(255,255,255,0.6)', borderRadius: '8px', padding: '7px 12px',
          fontSize: '12px', cursor: 'pointer', fontWeight: 500,
        }}>
          Override
        </button>
        <button style={{
          flex: 1, background: '#10B981', border: 'none',
          color: 'white', borderRadius: '8px', padding: '7px 12px',
          fontSize: '12px', cursor: 'pointer', fontWeight: 600,
        }}>
          Approve match
        </button>
      </div>
    </div>
  );
}

const SECTION_TITLE = {
  fontFamily: 'Newsreader, Georgia, serif', fontSize: '22px',
  color: 'white', fontWeight: 400, marginBottom: '12px',
};

const SECTION_WRAP = { marginBottom: '32px' };

export default function ApplicationDetail({ app, onBack }) {
  if (!app) return null;

  const color = scoreColor(app.score);

  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

      {/* LEFT COLUMN */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '13px', cursor: 'pointer', marginBottom: '24px', padding: 0, display: 'block' }}
        >
          ← Back to applications
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '38px', color: 'white', fontWeight: 400, lineHeight: 1.1, marginBottom: '12px' }}>
              {app.company_name}
            </h1>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[app.sector, app.stage].map(tag => (
                <span key={tag} style={{
                  background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px',
                  padding: '4px 12px', fontSize: '12px', fontWeight: 500,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '56px', fontStyle: 'italic', color, lineHeight: 1 }}>
              {app.score}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>
              {app.confidence} confidence
            </div>
          </div>
        </div>

        {/* AI Reasoning */}
        <div style={SECTION_WRAP}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h2 style={{ ...SECTION_TITLE, marginBottom: 0 }}>AI reasoning</h2>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
              3 sentences · Gemini 1.5 Pro
            </span>
          </div>
          <div style={{ background: '#0D1421', borderLeft: '3px solid #10B981', borderRadius: '0 8px 8px 0', padding: '16px 18px' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, fontSize: '14px', margin: 0 }}>
              {app.reasoning}
            </p>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '12px', marginBottom: 0 }}>
              ✦ scored by gemini
            </p>
          </div>
        </div>

        {/* Flags */}
        {app.flags?.length > 0 && (
          <div style={SECTION_WRAP}>
            <h2 style={SECTION_TITLE}>Flags</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {app.flags.map(flag => <FlagPill key={flag} flag={flag} />)}
            </div>
          </div>
        )}

        {/* Founder pitch */}
        <div style={SECTION_WRAP}>
          <h2 style={SECTION_TITLE}>Founder pitch</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.65, marginBottom: '10px' }}>
            {app.reasoning}
          </p>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
            {app.founder_name} · {app.sector} · {app.stage}
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div style={{ width: '340px', flexShrink: 0 }}>
        <h2 style={{ ...SECTION_TITLE, marginBottom: '16px' }}>Mentor suggestions</h2>

        {app.mentor_suggestions?.length > 0 ? (
          app.mentor_suggestions.map(s => <MentorCard key={s.mentor_id} suggestion={s} />)
        ) : (
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', color: 'rgba(255,255,255,0.3)', fontSize: '13px', lineHeight: 1.5 }}>
            No mentor suggestions yet — AI scoring required.
          </div>
        )}
      </div>

    </div>
  );
}
