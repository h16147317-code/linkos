const navItems = [
  { label: 'Dashboard',          view: 'dashboard',        file: 'Dashboard.jsx' },
  { label: 'Application Detail', view: 'detail',           file: 'ApplicationDetail.jsx' },
  { label: 'Mentors',            view: 'mentors',          file: 'Mentors.jsx' },
  { label: 'Memory Panel',       view: 'memory',           file: 'MemoryPanel.jsx' },
  { label: 'Founder Form',       view: 'founder-form',     file: 'FounderForm.jsx' },
  { label: 'Mentor Onboarding',  view: 'mentor-onboard',   file: 'MentorOnboarding.jsx' },
];

export default function Layout({ activeView, onNavigate, children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{
        width: '248px', background: '#070B14', position: 'fixed',
        top: 0, left: 0, height: '100vh', display: 'flex',
        flexDirection: 'column', padding: '24px 16px', overflowY: 'auto',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ paddingLeft: '12px', marginBottom: '32px' }}>
          <div style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '22px', color: 'white', fontWeight: 500 }}>
            LinkOS
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '3px' }}>
            Cradle Fund · Admin
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map(item => {
            const active = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  padding: '9px 12px', borderRadius: '8px', cursor: 'pointer',
                  textAlign: 'left', width: '100%',
                  background: active ? 'rgba(16,185,129,0.15)' : 'transparent',
                  border: active ? '1px solid transparent' : '1px solid transparent',
                  borderLeft: active ? '2px solid #10B981' : '2px solid transparent',
                  paddingLeft: active ? '10px' : '12px',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.querySelector('.nav-label').style.color = 'white'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelector('.nav-label').style.color = 'rgba(255,255,255,0.45)'; } }}
              >
                <span className="nav-label" style={{ color: active ? '#10B981' : 'rgba(255,255,255,0.45)', fontSize: '14px', fontWeight: 500, lineHeight: 1.3 }}>
                  {item.label}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>
                  {item.file}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div style={{
        marginLeft: '248px', flex: 1, background: '#0A0E1A',
        padding: '32px', minHeight: '100vh', overflowY: 'auto',
      }}>
        {children}
      </div>
    </div>
  );
}
