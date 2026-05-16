import { useState } from 'react';

const INPUT = {
  background: '#0D1421',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  padding: '10px 12px',
  color: 'white',
  fontFamily: 'inherit',
  fontSize: '13.5px',
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box',
};

const LABEL_MONO = {
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '10px',
  color: 'rgba(255,255,255,0.3)',
};

function Field({ label, fieldName, children }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 500 }}>{label}</span>
        <span style={LABEL_MONO}>{fieldName}</span>
      </div>
      {children}
    </div>
  );
}

export default function FounderForm() {
  const [form, setForm] = useState({
    name:          'Aisha Binti Rahman',
    email:         'aisha@nutriai.com',
    company_name:  'NutriAI Sdn Bhd',
    sector:        'healthtech',
    stage:         'pre-seed',
    country:       'Malaysia',
    team_size:     4,
    traction:      '2,000 active users, RM 15k MRR, 18% MoM growth',
    pitch_summary: 'AI-powered nutrition tracking for Southeast Asian diets. Built recommendation engine that accounts for local cuisine patterns.',
  });

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '38px', color: 'white', fontWeight: 400, lineHeight: 1.1 }}>
          Fill out once. <em style={{ color: '#10B981' }}>Apply forever.</em>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '8px' }}>
          Universal founder profile. Same form for every Cradle Fund programme — no more re-uploading the same pitch deck.
        </p>
      </div>

      <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '32px', maxWidth: '760px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* Row 1 */}
          <Field label="Founder Name" fieldName="name">
            <input style={INPUT} value={form.name} onChange={set('name')} />
          </Field>
          <Field label="Email" fieldName="email">
            <input style={INPUT} type="email" value={form.email} onChange={set('email')} />
          </Field>

          {/* Row 2 — full width */}
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Company Name" fieldName="company_name">
              <input style={INPUT} value={form.company_name} onChange={set('company_name')} />
            </Field>
          </div>

          {/* Row 3 */}
          <Field label="Sector" fieldName="sector">
            <select style={INPUT} value={form.sector} onChange={set('sector')}>
              {['healthtech', 'fintech', 'agritech', 'edtech', 'logistics'].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </Field>
          <Field label="Stage" fieldName="stage">
            <select style={INPUT} value={form.stage} onChange={set('stage')}>
              {['pre-seed', 'seed', 'series-a'].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </Field>

          {/* Row 4 */}
          <Field label="Country" fieldName="country">
            <select style={INPUT} value={form.country} onChange={set('country')}>
              {['Malaysia', 'Singapore', 'Indonesia'].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </Field>
          <Field label="Team Size" fieldName="team_size">
            <input style={INPUT} type="number" min={1} value={form.team_size} onChange={set('team_size')} />
          </Field>

          {/* Row 5 — full width */}
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Traction" fieldName="traction">
              <textarea
                style={{ ...INPUT, minHeight: '80px', resize: 'vertical' }}
                placeholder="e.g. 2,000 active users, RM 15k MRR"
                value={form.traction}
                onChange={set('traction')}
              />
            </Field>
          </div>

          {/* Row 6 — full width */}
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Pitch Summary" fieldName="pitch_summary">
              <textarea
                style={{ ...INPUT, minHeight: '80px', resize: 'vertical' }}
                placeholder="One paragraph about your startup and what makes it different"
                value={form.pitch_summary}
                onChange={set('pitch_summary')}
              />
            </Field>
          </div>

        </div>

        {/* Action bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', marginTop: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', cursor: 'pointer' }}>
              Save draft
            </button>
            <button style={{ background: '#10B981', border: 'none', color: 'white', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
              Save profile →
            </button>
          </div>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '12px', margin: '12px 0 0' }}>
            {'// TODO: swap mock for this when backend is ready — POST /api/founders'}
          </p>
        </div>
      </div>
    </div>
  );
}
