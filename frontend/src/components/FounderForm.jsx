import { useState } from 'react';

const API = 'http://localhost:3000';

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
    name:          '',
    email:         '',
    company_name:  '',
    industry:      'healthtech',
    stage:         'mvp',
    pitch_summary: '',
  });

  const [status,   setStatus]   = useState('idle'); // idle | saving | scoring | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [batchId,  setBatchId]  = useState(null);

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  async function handleSave() {
    if (!form.name || !form.email || !form.company_name) {
      setStatus('error');
      setErrorMsg('Name, email and company name are required.');
      return;
    }

    setStatus('saving');
    setErrorMsg('');
    setBatchId(null);

    try {
      // Step 1: Save founder profile
      const founderRes = await fetch(`${API}/api/founders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:          form.name,
          email:         form.email,
          company_name:  form.company_name,
          stage:         form.stage,
          industry:      form.industry,
          pitch_summary: form.pitch_summary,
        }),
      });
      const founderData = await founderRes.json();
      if (!founderRes.ok) throw new Error(founderData.error || 'Failed to save profile');

      const founderId = founderData.id;
      setStatus('scoring');

      // Step 2: Trigger AI scoring for the new founder
      const batchRes = await fetch(`${API}/api/applications/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applications: [{
            founder_id: founderId,
            answers: { problem: form.pitch_summary, solution: '', traction: '', ask: '' },
          }],
        }),
      });
      const batchData = await batchRes.json();
      if (!batchRes.ok) throw new Error(batchData.error || 'Failed to start scoring');

      setBatchId(batchData.batch_id);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  }

  function handleReset() {
    setForm({ name: '', email: '', company_name: '', industry: 'healthtech', stage: 'mvp', pitch_summary: '' });
    setStatus('idle');
    setErrorMsg('');
    setBatchId(null);
  }

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

          <Field label="Founder Name" fieldName="name">
            <input style={INPUT} value={form.name} onChange={set('name')} placeholder="e.g. Aisha Binti Rahman" />
          </Field>
          <Field label="Email" fieldName="email">
            <input style={INPUT} type="email" value={form.email} onChange={set('email')} placeholder="e.g. aisha@startup.my" />
          </Field>

          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Company Name" fieldName="company_name">
              <input style={INPUT} value={form.company_name} onChange={set('company_name')} placeholder="e.g. NutriAI Sdn Bhd" />
            </Field>
          </div>

          <Field label="Industry" fieldName="industry">
            <select style={INPUT} value={form.industry} onChange={set('industry')}>
              {['healthtech', 'fintech', 'agritech', 'edtech', 'cleantech', 'logistics', 'proptech', 'govtech', 'hrtech', 'cybersecurity'].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </Field>
          <Field label="Stage" fieldName="stage">
            <select style={INPUT} value={form.stage} onChange={set('stage')}>
              {['idea', 'mvp', 'seed', 'series_a'].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </Field>

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

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', marginTop: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={handleSave}
              disabled={status === 'saving' || status === 'scoring' || status === 'success'}
              style={{
                background: status === 'success' ? 'rgba(16,185,129,0.3)' : '#10B981',
                border: 'none', color: 'white', borderRadius: '8px', padding: '9px 16px',
                fontSize: '13px', fontWeight: 500,
                cursor: ['saving', 'scoring', 'success'].includes(status) ? 'not-allowed' : 'pointer',
                opacity: ['saving', 'scoring'].includes(status) ? 0.7 : 1,
              }}
            >
              {status === 'saving'  ? 'Saving…'           :
               status === 'scoring' ? 'Starting scoring…' :
               status === 'success' ? '✓ Submitted'       :
               'Save profile →'}
            </button>
            {status === 'success' && (
              <button
                onClick={handleReset}
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', cursor: 'pointer' }}
              >
                Add another →
              </button>
            )}
          </div>

          {status === 'success' && (
            <div style={{ marginTop: '14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', padding: '12px 14px' }}>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#10B981', margin: 0 }}>
                ✓ Saved! AI scoring started…
              </p>
              {batchId && (
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(16,185,129,0.6)', marginTop: '4px', margin: '4px 0 0' }}>
                  batch_id: {batchId}
                </p>
              )}
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '6px', margin: '6px 0 0' }}>
                The score will appear on the Dashboard within ~30 seconds.
              </p>
            </div>
          )}

          {status === 'error' && (
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#EF4444', marginTop: '12px', margin: '12px 0 0' }}>
              ✗ {errorMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
