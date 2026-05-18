import { useState, useEffect } from 'react';

const API = 'http://localhost:3000';

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

function MentorCard({ mentor, founderId }) {
  const [approving, setApproving] = useState(false);
  const [approved, setApproved]   = useState(false);
  const [errMsg, setErrMsg]       = useState('');
  const initials = mentor.name.split(' ').map(w => w[0]).join('').slice(0, 2);

  async function handleApprove() {
    setApproving(true);
    setErrMsg('');
    try {
      const res = await fetch(`${API}/api/linkages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          founder_id: founderId,
          mentor_id:  mentor.id,
          cohort:     12,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create linkage');
      setApproved(true);
    } catch (err) {
      setErrMsg(err.message);
    } finally {
      setApproving(false);
    }
  }

  const pct = mentor.utilisation_pct ?? 0;
  const pctColor = pct >= 90 ? '#EF4444' : pct >= 60 ? '#F59E0B' : '#10B981';

  return (
    <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #10B981, #065F46)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <em style={{ fontFamily: 'Newsreader, Georgia, serif', color: 'white', fontSize: '15px', fontWeight: 500 }}>{initials}</em>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 600, color: 'white', fontSize: '14px', lineHeight: 1.2 }}>{mentor.name}</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>
            {(mentor.expertise ?? []).slice(0, 3).join(' · ')}
          </p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '22px', fontStyle: 'italic', color: '#10B981', lineHeight: 1 }}>
            {Math.round(mentor.success_rate * 100)}%
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>
            success
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>Capacity</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: pctColor }}>{pct}%</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.08)', height: '4px', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: pctColor, borderRadius: '99px' }} />
        </div>
      </div>

      {errMsg && <p style={{ fontSize: '11px', color: '#EF4444', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>{errMsg}</p>}

      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{
          flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
          color: 'rgba(255,255,255,0.6)', borderRadius: '8px', padding: '7px 12px',
          fontSize: '12px', cursor: 'pointer', fontWeight: 500,
        }}>
          Override
        </button>
        <button
          onClick={handleApprove}
          disabled={approving || approved}
          style={{
            flex: 1, background: approved ? 'rgba(16,185,129,0.3)' : '#10B981', border: 'none',
            color: 'white', borderRadius: '8px', padding: '7px 12px',
            fontSize: '12px', cursor: approved || approving ? 'not-allowed' : 'pointer',
            fontWeight: 600, opacity: approving ? 0.7 : 1,
          }}
        >
          {approved ? '✓ Matched' : approving ? 'Matching…' : 'Approve match'}
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
  const [scoreData,    setScoreData]    = useState(null);
  const [scoreStatus,  setScoreStatus]  = useState('loading');
  const [refreshKey,   setRefreshKey]   = useState(0);
  const [mentors,      setMentors]      = useState([]);

  // Fetch score whenever app changes or user hits Refresh
  useEffect(() => {
    if (!app?.id) return;
    setScoreData(null);
    setScoreStatus('loading');

    fetch(`${API}/api/founders/${app.id}/score`)
      .then(async r => {
        if (r.status === 202) { setScoreStatus('processing'); return; }
        if (r.status === 404) { setScoreStatus('unscored');   return; }
        if (!r.ok) throw new Error('Failed to fetch score');
        const d = await r.json();
        setScoreData(d);
        setScoreStatus('scored');
      })
      .catch(() => setScoreStatus('error'));
  }, [app?.id, refreshKey]);

  // Fetch all mentors, filter by founder's industry for suggestions
  useEffect(() => {
    if (!app?.industry) return;
    fetch(`${API}/api/mentors`)
      .then(r => r.json())
      .then(data => {
        const all = data.mentors ?? [];
        const matched = all
          .filter(m => m.availability && m.current_load < m.capacity &&
                       (m.industry ?? []).includes(app.industry))
          .sort((a, b) => b.success_rate - a.success_rate)
          .slice(0, 3);
        // Fall back to top-3 by success_rate if no industry match
        if (matched.length === 0) {
          const fallback = all
            .filter(m => m.availability && m.current_load < m.capacity)
            .sort((a, b) => b.success_rate - a.success_rate)
            .slice(0, 3);
          setMentors(fallback);
        } else {
          setMentors(matched);
        }
      })
      .catch(() => setMentors([]));
  }, [app?.industry]);

  if (!app) return null;

  const score     = scoreData?.score      ?? app.score;
  const tier      = scoreData?.tier       ?? app.tier;
  const confidence = scoreData?.confidence ?? null;
  const flags     = scoreData?.flags      ?? [];
  const reasoning = scoreData?.summary    ?? null;
  const color     = score != null ? scoreColor(score) : 'rgba(255,255,255,0.2)';

  const isWaiting = scoreStatus === 'loading' || scoreStatus === 'processing' || scoreStatus === 'unscored';

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
              {[app.industry, app.stage].filter(Boolean).map(tag => (
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

          {/* Score + Refresh */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            {score != null ? (
              <>
                <div style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '56px', fontStyle: 'italic', color, lineHeight: 1 }}>
                  {score}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>
                  {confidence ? `${confidence} confidence` : tier ?? ''}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#F59E0B', marginBottom: '10px' }}>
                  {scoreStatus === 'loading'    ? 'Loading score…' : 'AI scoring in progress…'}
                </p>
                <button
                  onClick={() => setRefreshKey(k => k + 1)}
                  style={{
                    background: 'transparent', border: '1px solid rgba(245,158,11,0.4)',
                    color: '#F59E0B', borderRadius: '8px', padding: '6px 14px',
                    fontSize: '12px', cursor: 'pointer', fontWeight: 500,
                  }}
                >
                  ↻ Refresh
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI Reasoning */}
        {reasoning ? (
          <div style={SECTION_WRAP}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h2 style={{ ...SECTION_TITLE, marginBottom: 0 }}>AI reasoning</h2>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                Gemini · CIP Catalyser
              </span>
            </div>
            <div style={{ background: '#0D1421', borderLeft: '3px solid #10B981', borderRadius: '0 8px 8px 0', padding: '16px 18px' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, fontSize: '14px', margin: 0 }}>
                {reasoning}
              </p>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '12px', marginBottom: 0 }}>
                ✦ scored by gemini
              </p>
            </div>
          </div>
        ) : isWaiting && (
          <div style={{ ...SECTION_WRAP, background: '#111827', borderLeft: '3px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '16px 18px' }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#F59E0B', margin: 0 }}>
              AI scoring in progress — click Refresh to check
            </p>
            <button
              onClick={() => setRefreshKey(k => k + 1)}
              style={{
                marginTop: '10px', background: 'transparent', border: '1px solid rgba(245,158,11,0.4)',
                color: '#F59E0B', borderRadius: '8px', padding: '5px 12px',
                fontSize: '12px', cursor: 'pointer', fontWeight: 500,
              }}
            >
              ↻ Refresh score
            </button>
          </div>
        )}

        {/* Flags */}
        {flags.length > 0 && (
          <div style={SECTION_WRAP}>
            <h2 style={SECTION_TITLE}>Flags</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {flags.map(flag => <FlagPill key={flag} flag={flag} />)}
            </div>
          </div>
        )}

        {/* Founder profile */}
        <div style={SECTION_WRAP}>
          <h2 style={SECTION_TITLE}>Founder profile</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.65, marginBottom: '10px' }}>
            {app.pitch_summary ?? reasoning ?? 'No pitch summary available.'}
          </p>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
            {app.name} · {app.industry} · {app.stage}
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN — Mentor suggestions */}
      <div style={{ width: '340px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ ...SECTION_TITLE, marginBottom: 0 }}>Mentor suggestions</h2>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
            by industry match
          </span>
        </div>

        {mentors.length > 0 ? (
          mentors.map(m => <MentorCard key={m.id} mentor={m} founderId={app.id} />)
        ) : (
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', color: 'rgba(255,255,255,0.3)', fontSize: '13px', lineHeight: 1.5 }}>
            No available mentors for {app.industry} at this time.
          </div>
        )}
      </div>

    </div>
  );
}
