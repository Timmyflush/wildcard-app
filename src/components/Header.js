import React from 'react';
import SpadeIcon from './SpadeIcon';

export default function Header({ activeTab, setActiveTab, savedCount }) {
  const tabs = [
    { id: 'tournaments', label: 'Tournaments' },
    { id: 'saved', label: `Saved (${savedCount})` },
    { id: 'ai', label: 'AI Planner' },
  ];

  return (
    <header style={{
      background: 'linear-gradient(180deg, #0a0f14 0%, #0f1923 100%)',
      borderBottom: '1px solid rgba(255,107,26,0.3)',
      boxShadow: '0 2px 20px rgba(255,69,0,0.15)',
      flexShrink: 0,
      zIndex: 10,
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px 8px',
      }}>
        <SpadeIcon size={28} glow={true} />
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: '700',
            background: 'linear-gradient(90deg, #ffaa00, #ff6b1a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '3px',
          }}>
            WILDCARD
          </div>
          <div style={{
            fontSize: '10px',
            color: 'var(--text-secondary)',
            letterSpacing: '2px',
            fontWeight: '500',
            marginTop: '-2px',
          }}>
            POKER TRIP PLANNER
          </div>
        </div>
      </div>

      {/* Nav tabs */}
      <nav style={{
        display: 'flex',
        padding: '0 16px',
        gap: '4px',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '8px 4px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id
                ? '2px solid var(--flame-mid)'
                : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--flame-tip)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textTransform: 'uppercase',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
