import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ApplicationDetail from './components/ApplicationDetail';
import Mentors from './components/Mentors';
import MemoryPanel from './components/MemoryPanel';
import MentorOnboarding from './components/MentorOnboarding';
import FounderForm from './components/FounderForm';

function Placeholder({ label }) {
  return (
    <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '32px', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>
      {label}
    </div>
  );
}

function App() {
  const [activeView, setActiveView]   = useState('dashboard');
  const [selectedApp, setSelectedApp] = useState(null);

  function handleSelectApp(app) {
    setSelectedApp(app);
    setActiveView('detail');
  }

  function renderView() {
    switch (activeView) {
      case 'dashboard':      return <Dashboard onSelectApp={handleSelectApp} />;
      case 'detail':         return <ApplicationDetail app={selectedApp} onBack={() => setActiveView('dashboard')} />;
      case 'mentors':        return <Mentors />;
      case 'memory':         return <MemoryPanel />;
      case 'mentor-onboard': return <MentorOnboarding />;
      case 'founder-form':   return <FounderForm />;
      default:               return <Placeholder label={activeView} />;
    }
  }

  return (
    <Layout activeView={activeView} onNavigate={setActiveView}>
      {renderView()}
    </Layout>
  );
}

export default App;
