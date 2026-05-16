import { useState } from 'react';

function ConnectCard({ icon, title, notConnectedText, connectedText, linked, onToggle, dashed }) {
  return (
    <div
      onClick={onToggle}
      style={{
        background: linked ? 'rgba(16,185,129,0.08)' : '#111827',
        border: `1px ${dashed && !linked ? 'dashed' : 'solid'} ${linked ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '12px', padding: '16px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px',
      }}
    >
      <div style={{
        width: '44px', height: '44px', borderRadius: '8px', flexShrink: 0,
        background: linked ? '#10B981' : 'rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: linked ? 'white' : 'rgba(255,255,255,0.5)', fontSize: '15px', fontWeight: 700,
        fontFamily: 'JetBrains Mono, monospace',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ color: 'white', fontSize: '14px', fontWeight: 600, marginBottom: '3px' }}>{title}</p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0 }}>{linked ? connectedText : notConnectedText}</p>
      </div>
      <div style={{
        width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
        background: linked ? '#10B981' : 'transparent',
        border: linked ? 'none' : '2px dashed rgba(255,255,255,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {linked && <span style={{ color: 'white', fontSize: '11px', fontWeight: 700, lineHeight: 1 }}>✓</span>}
      </div>
    </div>
  );
}

const LABEL = { fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' };
const CHIP  = { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '3px 8px', fontSize: '11px', display: 'inline-block', marginRight: '5px', marginBottom: '4px' };
const ROW   = { borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '14px', marginBottom: '14px' };

export default function MentorOnboarding() {
  const [liLinked, setLiLinked] = useState(false);
  const [ghLinked, setGhLinked] = useState(false);
  const [cvLinked, setCvLinked] = useState(false);

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '38px', color: 'white', fontWeight: 400, lineHeight: 1.1 }}>
          Mentors plug in. <em style={{ color: '#10B981' }}>AI does the rest.</em>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '8px' }}>
          This is what fills the mentor database automatically. LinkedIn, GitHub, CV — Gemini extracts expertise and sectors. No manual forms.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* LEFT */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <ConnectCard
            icon="in"
            title="LinkedIn"
            notConnectedText="Click to connect your profile"
            connectedText="247 connections imported · 6 roles parsed"
            linked={liLinked}
            onToggle={() => setLiLinked(v => !v)}
          />
          <ConnectCard
            icon="⊕"
            title="GitHub"
            notConnectedText="Click to connect your account"
            connectedText="38 repos analysed · 12 languages detected"
            linked={ghLinked}
            onToggle={() => setGhLinked(v => !v)}
          />
          <ConnectCard
            icon="↑"
            title="Upload CV / Resume"
            notConnectedText="Click to upload your CV"
            connectedText="Resume parsed · 4 roles extracted"
            linked={cvLinked}
            onToggle={() => setCvLinked(v => !v)}
            dashed
          />

          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '14px 16px', marginTop: '4px' }}>
            <p style={{ color: 'rgba(16,185,129,0.9)', fontSize: '13px', lineHeight: 1.55, margin: 0 }}>
              This screen fills the mentor database that powers all AI matching. Connect once — Gemini does the extraction.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ width: '380px', flexShrink: 0 }}>
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '20px', color: 'white', fontWeight: 400, margin: 0 }}>What Gemini extracted</h3>
              <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', borderRadius: '999px', padding: '3px 10px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ● live
              </span>
            </div>

            <div style={ROW}>
              <p style={LABEL}>Name</p>
              <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>Ahmad Razali</p>
            </div>
            <div style={ROW}>
              <p style={LABEL}>Bio summary</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: 1.55, margin: 0 }}>
                15 years in Malaysian healthtech and venture ecosystem. Former investment manager at Cradle Fund. Mentored 12 startups across 4 cohorts with strong sector alignment in digital health.
              </p>
            </div>
            <div style={ROW}>
              <p style={LABEL}>Expertise tags</p>
              <div>
                {['healthtech', 'fundraising', 'product strategy', 'due diligence'].map(t => (
                  <span key={t} style={CHIP}>{t}</span>
                ))}
              </div>
            </div>
            <div style={ROW}>
              <p style={LABEL}>Sectors</p>
              <div>
                {['healthtech', 'biotech', 'medtech'].map(t => (
                  <span key={t} style={CHIP}>{t}</span>
                ))}
              </div>
            </div>
            <div>
              <p style={LABEL}>Suggested capacity</p>
              <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>
                5 mentees <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>· based on past load</span>
              </p>
            </div>
          </div>

          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              Ready to save · POST /api/mentors
            </span>
            <button style={{ background: '#10B981', border: 'none', color: 'white', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Add to mentor pool →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
